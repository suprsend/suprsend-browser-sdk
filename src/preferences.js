import create_signature from "./encryption";
import config from "./config";
import utils from "./utils";

export const PreferenceOptions = { OPT_IN: "opt_in", OPT_OUT: "opt_out" };
export const ChannelLevelPreferenceOptions = {
  ALL: "all",
  REQUIRED: "required",
};

class Preferences {
  constructor(instance, emitter) {
    this.ss_instance = instance;
    this._preference_data;
    this._preference_args;
    this._emitter = emitter;

    this._debounced_update_category_preferences = utils.debounce_by_type(
      this._update_category_preferences,
      config.preference_debounce
    );
    this._debounced_update_channel_preferences = utils.debounce_by_type(
      this._update_channel_preferences,
      config.preference_debounce
    );
  }

  _validate_query_params(query_params = {}) {
    let validated_params = {};
    for (let key in query_params) {
      if (query_params[key]) {
        validated_params[key] = query_params[key];
      }
    }
    return validated_params;
  }

  async _get_request(route = "", query_params = {}) {
    const preference_base_url = `/v1/subscriber/${this.ss_instance.distinct_id}`;
    const validated_query_params = this._validate_query_params(query_params);
    const query_params_string = new URLSearchParams(
      validated_query_params
    ).toString();

    const full_url_path = query_params_string
      ? `${preference_base_url}/${route}/?${query_params_string}`
      : `${preference_base_url}/${route}`;

    const requested_date = new Date().toGMTString();
    const signature = await create_signature(
      "",
      requested_date,
      "GET",
      full_url_path
    );
    const authorization = signature
      ? `${config.env_key}:${signature}`
      : config.env_key;

    try {
      const resp = await fetch(`${config.api_url}${full_url_path}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: authorization,
          "x-amz-date": requested_date,
        },
      });
      if (resp.ok) {
        const respData = resp.json();
        return respData;
      }
      return {
        error: true,
        api_error: true,
        status_code: resp.status,
        message: resp.statusText,
        error_obj: null,
      };
    } catch (e) {
      return {
        error: true,
        api_error: false,
        status_code: null,
        message: e.message,
        error_obj: e,
      };
    }
  }

  async _update_request(body, route, query_params) {
    const preference_base_url = `/v1/subscriber/${this.ss_instance.distinct_id}`;
    const validated_query_params = this._validate_query_params(query_params);
    const query_params_string = new URLSearchParams(
      validated_query_params
    ).toString();

    const full_url_path = query_params_string
      ? `${preference_base_url}/${route}/?${query_params_string}`
      : `${preference_base_url}/${route}`;

    const requested_date = new Date().toGMTString();
    const bodyString = JSON.stringify(body);
    const signature = await create_signature(
      bodyString,
      requested_date,
      "POST",
      full_url_path
    );
    const authorization = signature
      ? `${config.env_key}:${signature}`
      : config.env_key;

    try {
      const resp = await fetch(`${config.api_url}${full_url_path}`, {
        method: "POST",
        body: bodyString,
        headers: {
          "Content-Type": "application/json",
          Authorization: authorization,
          "x-amz-date": requested_date,
        },
      });
      if (resp.ok) {
        const respData = resp.json();
        return respData;
      }
      return {
        error: true,
        api_error: true,
        status_code: resp.status,
        message: resp.statusText,
        error_obj: null,
      };
    } catch (e) {
      return {
        error: true,
        api_error: false,
        status_code: null,
        message: e.message,
        error_obj: e,
      };
    }
  }

  _update_category_preferences = async (
    category = "",
    body = {},
    subcategory,
    args = {}
  ) => {
    let url_path = `category/${category}`;
    const response = await this._update_request(body, url_path, args);
    if (response?.error) {
      this._emitter.emit("preferences_error", response);
    } else {
      Object.assign(subcategory, response);
      this._emitter.emit("preferences_updated", this.data);
    }
    return response;
  };

  _update_channel_preferences = async (body = {}) => {
    let url_path = "channel_preference";
    const response = await this._update_request(body, url_path);
    if (response?.error) {
      this._emitter.emit("preferences_error", response);
    } else {
      await this.get_preferences(this._preference_args);
      this._emitter.emit("preferences_updated", this.data);
    }
    return response;
  };

  set data(value) {
    this._preference_data = value;
  }

  get data() {
    return this._preference_data;
  }

  async get_preferences(args = {}) {
    let url_path = "full_preference";
    let query_params = { tenant_id: args?.tenant_id };

    const response = await this._get_request(url_path, query_params);
    if (!response?.error) {
      this.data = response;
    }
    return response;
  }

  async get_categories(args = {}) {
    let url_path = "category";
    const query_params = {
      tenant_id: args?.tenant_id,
      limit: args?.limit,
      offset: args?.offset,
    };

    const response = await this._get_request(url_path, query_params);
    return response;
  }

  async get_category(category = "", args = {}) {
    if (!category) {
      return {
        error: true,
        message: "Category parameter is missing",
      };
    }

    let url_path = `category/${category}`;
    let query_params = { tenant_id: args?.tenant_id };

    const response = await this._get_request(url_path, query_params);
    return response;
  }

  async get_overall_channel_preferences() {
    let url_path = `channel_preference`;
    const response = await this._get_request(url_path);
    return response;
  }

  update_category_preference(category = "", preference = "", args = {}) {
    if (
      !category ||
      ![PreferenceOptions.OPT_IN, PreferenceOptions.OPT_OUT].includes(
        preference
      )
    ) {
      return {
        error: true,
        message: !category
          ? "Category parameter is missing"
          : "Preference parameter is invalid",
      };
    }

    if (!this.data) {
      return {
        error: true,
        message: "Call get_preferences method before performing action",
      };
    }

    let category_data;
    let data_updated = false;

    // optimistic update in local store
    for (let section of this.data.sections) {
      let abort = false;
      for (let subcategory of section.subcategories) {
        if (subcategory.category === category) {
          category_data = subcategory;
          if (subcategory.is_editable) {
            if (subcategory.preference !== preference) {
              subcategory.preference = preference;
              data_updated = true;
              abort = true;
              break;
            } else {
              // console.log(`category is already ${status}ed`);
            }
          } else {
            return {
              error: true,
              message: "Category preference is not editable",
            };
          }
        }
      }
      if (abort) break;
    }

    if (!category_data) {
      return {
        error: true,
        message: "Category is not found",
      };
    }

    if (!data_updated) {
      return this.data;
    }

    const opt_out_channels = [];
    category_data.channels.forEach((channel) => {
      if (channel.preference === PreferenceOptions.OPT_OUT) {
        opt_out_channels.push(channel.channel);
      }
    });

    const request_payload = {
      preference: category_data.preference,
      opt_out_channels,
    };

    this._debounced_update_category_preferences(
      category,
      category,
      request_payload,
      category_data,
      { tenant_id: args?.tenant_id }
    );

    return this.data;
  }

  update_channel_preference_in_category(
    channel = "",
    preference = "",
    category = "",
    args = {}
  ) {
    if (!channel || !category) {
      return {
        error: true,
        message: !channel
          ? "Channel parameter is missing"
          : "Category parameter is missing",
      };
    } else if (
      ![PreferenceOptions.OPT_IN, PreferenceOptions.OPT_OUT].includes(
        preference
      )
    ) {
      return {
        error: true,
        message: "Preference parameter is invalid",
      };
    }

    if (!this.data) {
      return {
        error: true,
        message: "Call get_preferences method before performing action",
      };
    }

    let category_data;
    let selected_channel_data;
    let data_updated = false;

    // optimistic update in local store
    for (let section of this.data.sections) {
      let abort = false;
      for (let subcategory of section.subcategories) {
        if (subcategory.category === category) {
          category_data = subcategory;
          for (let channel_data of subcategory.channels) {
            if (channel_data.channel === channel) {
              selected_channel_data = channel_data;
              if (channel_data.is_editable) {
                if (channel_data.preference !== preference) {
                  channel_data.preference = preference;
                  if (preference === PreferenceOptions.OPT_IN) {
                    subcategory.preference = PreferenceOptions.OPT_IN;
                  }
                  data_updated = true;
                  abort = true;
                  break;
                } else {
                  //  console.log(`channel is already ${preference}`);
                }
              } else {
                return {
                  error: true,
                  message: "Channel preference is not editable",
                };
              }
            }
          }
        }
        if (abort) break;
      }
      if (abort) break;
    }

    if (!category_data) {
      return {
        error: true,
        message: "Category not found",
      };
    }

    if (!selected_channel_data) {
      return {
        error: true,
        message: "Category's Channel not found",
      };
    }

    if (!data_updated) {
      return this.data;
    }

    const opt_out_channels = [];
    category_data.channels.forEach((channel) => {
      if (channel.preference === PreferenceOptions.OPT_OUT) {
        opt_out_channels.push(channel.channel);
      }
    });

    const request_payload = {
      preference: category_data.preference,
      opt_out_channels,
    };

    this._debounced_update_category_preferences(
      category,
      category,
      request_payload,
      category_data,
      { tenant_id: args?.tenant_id }
    );

    return this.data;
  }

  update_overall_channel_preference(channel = "", preference = "") {
    if (
      !channel ||
      ![
        ChannelLevelPreferenceOptions.ALL,
        ChannelLevelPreferenceOptions.REQUIRED,
      ].includes(preference)
    ) {
      return {
        error: true,
        message: !channel
          ? "Channel parameter is missing"
          : "Preference parameter is invalid",
      };
    }

    if (!this.data) {
      return {
        error: true,
        message: "Call get_preferences method before performing action",
      };
    }

    let channel_data;
    let data_updated = false;
    const preference_restricted =
      preference === ChannelLevelPreferenceOptions.REQUIRED;

    for (let channel_item of this.data.channel_preferences) {
      if (channel_item.channel === channel) {
        channel_data = channel_item;
        if (channel_item.is_restricted !== preference_restricted) {
          channel_item.is_restricted = preference_restricted;
          data_updated = true;
          break;
        }
      }
    }

    if (!channel_data) {
      return {
        error: true,
        message: "Channel data not found",
      };
    }

    if (!data_updated) {
      return this.data;
    }

    this._debounced_update_channel_preferences(channel_data.channel, {
      channel_preferences: [channel_data],
    });

    return this.data;
  }
}

export default Preferences;
