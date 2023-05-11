import utils from "./utils";
import config from "./config";
import { regex, constants } from "./constants";
import { parsePhoneNumber } from "libphonenumber-js";

class User {
  constructor(instance) {
    this.instance = instance;
    this.preference_base_url = `${config.api_url}/v1/subscriber/${instance.distinct_id}`;
    this._preference_data = null;
  }

  _call_indentity(properties) {
    utils.batch_or_call({
      env: config.env_key,
      distinct_id: this.instance.distinct_id,
      $insert_id: utils.uuid(),
      $time: utils.epoch_milliseconds(),
      ...properties,
    });
  }

  _call_flush_immediately(properties) {
    utils
      .api(constants.api_events_route, {
        env: config.env_key,
        distinct_id: this.instance.distinct_id,
        $insert_id: utils.uuid(),
        $time: utils.epoch_milliseconds(),
        ...properties,
      })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Error in Fetch");
        }
      })
      .catch(() => {
        this._call_indentity(properties);
      });
  }

  _allow_special_char_events = (key) => {
    return (
      key === "$email" ||
      key === "$whatsapp" ||
      key === "$sms" ||
      key?.["$webpush"]
    );
  };

  _convert_to_number(obj) {
    if (!utils.is_empty(obj)) {
      for (let key in obj) {
        const number = Number(obj[key]);
        if (!number) {
          delete obj[key];
        } else {
          obj[key] = number;
        }
      }
    }
    return obj;
  }

  _validate_email_and_send(key, email) {
    if (regex.email.test(email)) {
      this.append(key, email);
    } else {
      console.log("SuprSend: Provide valid Email ID");
    }
  }

  _validate_mobile_and_send(key, mobile) {
    try {
      const mobile_number = parsePhoneNumber(mobile);
      if (mobile_number.isValid()) {
        this.append(key, mobile);
      } else {
        console.log("SuprSend: Provide valid Mobile number");
      }
    } catch (err) {
      console.log("SuprSend: Provide valid Mobile number");
    }
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

  async _get_preference_request(route = "", query_params = {}) {
    const validated_query_params = this._validate_query_params(query_params);
    const query_params_string = new URLSearchParams(
      validated_query_params
    ).toString();

    const full_url_path = query_params_string
      ? `${route}/?${query_params_string}`
      : route;

    try {
      const resp = await fetch(`${this.preference_base_url}/${full_url_path}`);
      if (resp.ok) {
        const respData = resp.json();
        return respData;
      }
      console.log(`Error: ${resp.status}: ${resp.statusText}`);
    } catch (e) {
      console.log("Error", e);
    }
    return;
  }

  async _update_preference_request(body, route, query_params) {
    const validated_query_params = this._validate_query_params(query_params);
    const query_params_string = new URLSearchParams(
      validated_query_params
    ).toString();

    const full_url_path = query_params_string
      ? `${route}/?${query_params_string}`
      : route;

    try {
      const resp = await fetch(`${this.preference_base_url}/${full_url_path}`, {
        method: "POST",
        body,
      });
      if (resp.ok) {
        const respData = resp.json();
        return respData;
      }
      console.log(`Error: ${resp.status}: ${resp.statusText}`);
    } catch (e) {
      console.log("Error", e);
    }
    return;
  }

  get preference_data() {
    return this._preference_data;
  }

  set preference_data(value) {
    this._preference_data = value;
  }

  set(key, value) {
    const data = utils.format_props({ key, value });
    if (!utils.is_empty(data)) {
      this._call_indentity({ $set: data });
    }
  }

  set_once(key, value) {
    const data = utils.format_props({ key, value });
    if (!utils.is_empty(data)) {
      this._call_indentity({ $set_once: data });
    }
  }

  increment(key, value = 1) {
    const data = utils.format_props({ key, value });
    const formatted_data = this._convert_to_number(data);
    if (!utils.is_empty(formatted_data)) {
      this._call_indentity({ $add: formatted_data });
    }
  }

  append(key, value) {
    const allow_special_tags = this._allow_special_char_events(key);
    const data = utils.format_props({ key, value, allow_special_tags });
    if (!utils.is_empty(data)) {
      this._call_indentity({ $append: data });
    }
  }

  remove(key, value, config = {}) {
    const allow_special_tags = this._allow_special_char_events(key);
    const data = utils.format_props({ key, value, allow_special_tags });
    if (!utils.is_empty(data)) {
      if (config?.flush_immediately) {
        this._call_flush_immediately({ $remove: data });
      } else {
        this._call_indentity({ $remove: data });
      }
    }
  }

  unset(key) {
    let formatted_data;
    if (typeof key === "string") {
      if (!utils.has_special_char(key)) {
        formatted_data = [key];
      } else {
        console.log("SuprSend: key cannot start with $ or ss_");
      }
    } else if (Array.isArray(key)) {
      formatted_data = [];
      key.forEach((item) => {
        if (!utils.has_special_char(String(item))) {
          formatted_data.push(String(item));
        }
      });
    }
    if (!utils.is_empty(formatted_data)) {
      this._call_indentity({ $unset: formatted_data });
    }
  }

  add_email(email = "") {
    this._validate_email_and_send("$email", email);
  }

  remove_email(email = "") {
    this.remove("$email", email);
  }

  add_sms(mobile = "") {
    this._validate_mobile_and_send("$sms", mobile);
  }

  remove_sms(mobile = "") {
    this.remove("$sms", mobile);
  }

  add_whatsapp(mobile = "") {
    this._validate_mobile_and_send("$whatsapp", mobile);
  }

  remove_whatsapp(mobile = "") {
    this.remove("$whatsapp", mobile);
  }

  add_webpush(push = "") {
    this.append({
      $webpush: push,
      $device_id: this.instance?.env_properties?.$device_id,
      $pushvendor: "vapid",
    });
  }

  remove_webpush(push = "") {
    this.remove(
      {
        $webpush: push,
        $device_id: this.instance?.env_properties?.$device_id,
        $pushvendor: "vapid",
      },
      null,
      { flush_immediately: true }
    );
  }

  async get_full_preferences(brand_id = "") {
    let url_path = "full_preference";
    let query_params = { brand_id };

    const response = await this._get_preference_request(url_path, query_params);
    this.preference_data = response;
    return this.preference_data;
  }

  // async get_all_category_preferences(brand_id = "", config = {}) {
  //   let url_path = "category";
  //   const query_params = { brand_id, limit: config?.limit || 50 };

  //   const response = await this._get_preference_request(url_path, query_params);
  //   return response;
  // }

  // async get_category_preferences(category_id = "", brand_id = "") {
  //   let url_path = `category/${category_id}`;
  //   let query_params = { brand_id };

  //   const response = await this._get_preference_request(url_path, query_params);
  //   return response;
  // }

  // async get_channel_preferences() {
  //   let url_path = `channel_preference`;
  //   const response = await this._get_preference_request(url_path);
  //   return response;
  // }

  async _update_category_preferences(category = "", body = {}, brand_id = "") {
    let url_path = `category/${category}`;
    const response = await this._update_preference_request(body, url_path, {
      brand_id,
    });
    return response;
  }

  async _update_channel_preferences(body = {}) {
    let url_path = "channel_preference";
    const response = await this._update_preference_request(body, url_path);
    return response;
  }

  update_category_subscription_status(
    category = "",
    status = "optin/optout",
    brand_id = ""
  ) {
    if (!this.preference_data) {
      console.log("Preferences data not set. Call get_full_preferences method");
    }
    let subcategory_data;
    // optimistic update in local store
    for (let header of this.preference_data.categories) {
      let abort = false;
      if (header?.sections?.length > 0) {
        const sections = header.sections;
        for (let subcategory of sections.subcategories) {
          if (subcategory.slug === category) {
            subcategory_data = subcategory;
            if (subcategory.can_unsubscribe) {
              subcategory.subscription_status = status;
              abort = true;
              break;
            } else {
              console.log("category status cannot be unsubscribers");
            }
          }
        }
        if (abort) break;
      }
    }

    const requestPayload = {
      subscription_status: subcategory_data.subscription_status,
      unsubscribed_channels: subcategory_data.channels.filter(
        (channel) => channel.value === "opt_out"
      ),
    };

    this._update_category_preferences(category, requestPayload, brand_id);
  }

  async subscribe_category_channel(category = "", channel = "") {
    if (!this.preference_data) {
      console.log("Preferences data not set. Call get_full_preferences method");
    }
    let subcategory_data;
    // optimistic update in local store
    for (let header of this.preference_data.categories) {
      let abort = false;
      if (header?.sections?.length > 0) {
        const sections = header.sections;
        for (let subcategory of sections.subcategories) {
          if (subcategory.slug === category) {
            subcategory_data = subcategory;
            for (let channel_data of subcategory.channels) {
              if (channel_data.slug === channel) {
                channel_data.value = "opt_in";
                abort = true;
                break;
              }
            }
            if (abort) break;
          }
        }
        if (abort) break;
      }
    }

    const requestPayload = {
      subscription_status: subcategory_data.subscription_status,
      unsubscribed_channels: subcategory_data.channels.filter(
        (channel) => channel.value === "opt_out"
      ),
    };

    this._update_category_preferences(category, requestPayload);
  }

  async unsubscribe_category_channel(category = "", channel = "") {
    if (!this.preference_data) {
      console.log("Preferences data not set. Call get_full_preferences method");
    }
    let subcategory_data;
    // optimistic update in local store
    for (let header of this.preference_data.categories) {
      let abort = false;
      if (header?.sections?.length > 0) {
        const sections = header.sections;
        for (let subcategory of sections.subcategories) {
          if (subcategory.slug === category) {
            subcategory_data = subcategory;
            for (let channel_data of subcategory.channels) {
              if (channel_data.slug === channel) {
                channel_data.value = "opt_out";
                abort = true;
                break;
              }
            }
            if (abort) break;
          }
        }
        if (abort) break;
      }
    }

    const requestPayload = {
      subscription_status: subcategory_data.subscription_status,
      unsubscribed_channels: subcategory_data.channels.filter(
        (channel) => channel.value === "opt_out"
      ),
    };

    this._update_category_preferences(category, requestPayload);
  }

  async update_channel_preference(channel = "", type = "") {
    let channel_data;
    const channel_preference = this.preference_data.channel_preference;

    for (let channel_item of channel_preference) {
      if (channel_item.channel === channel) {
        channel_data = channel_item;
        channel_item.important_message_only = type === "required";
        break;
      }
    }

    this._update_channel_preferences({
      channel_preferences: [channel_data],
    });
  }
}

export default User;
