import utils from "./utils";
import config from "./config";
import User from "./user";
import WebPush from "./web_push";
import { constants, internal_events } from "./constants";
import { SSConfigurationError } from "./errors";
import mitt from "mitt";
export {
  PreferenceOptions,
  ChannelLevelPreferenceOptions,
} from "./preferences";

var suprSendInstance;
export var initialisedAt;

class SuprSend {
  init(ENV_API_KEY, SIGNING_KEY, config_keys = {}) {
    config_keys.env = ENV_API_KEY;
    config_keys.signing_key = SIGNING_KEY;
    var distinct_id = utils.get_cookie(constants.distinct_id);
    if (!suprSendInstance) {
      suprSendInstance = {};
      this._set_custom_config(config_keys);
    }
    if (!distinct_id) {
      distinct_id = utils.uuid();
      utils.set_cookie(constants.distinct_id, distinct_id);
    }
    suprSendInstance.distinct_id = distinct_id;

    this.emitter = mitt();
    this.user = new User(suprSendInstance, this.emitter);
    this.web_push = new WebPush(suprSendInstance);

    this.web_push.update_subscription();
    SuprSend._set_env_properties();
    if (!initialisedAt) {
      utils.bulk_call_api();
      this.track(internal_events.app_launched);
    }
    initialisedAt = new Date();
  }

  static _set_env_properties() {
    let device_id = utils.get_local_storage_item(constants.device_id_key);
    if (!device_id) {
      device_id = utils.uuid();
      utils.set_local_storage_item(constants.device_id_key, device_id);
    }
    suprSendInstance.env_properties = {
      $os: utils.os(),
      $browser: utils.browser(),
      $browser_version: utils.browser_version(),
      $sdk_type: "Browser",
      $device_id: device_id,
      $sdk_version: config.sdk_version,
    };
  }

  _set_custom_config_property(key, value = "", mandatory = false) {
    if (value) {
      config[key] = value;
    } else {
      if (mandatory) {
        throw new SSConfigurationError(`Mandatory Key Missing: ${key}`);
      }
    }
  }

  _set_custom_config(config_keys) {
    this._set_custom_config_property("env_key", config_keys.env, true);
    this._set_custom_config_property(
      "signing_key",
      config_keys.signing_key,
      true
    );
    this._set_custom_config_property("api_url", config_keys?.api_url);
    this._set_custom_config_property("vapid_key", config_keys?.vapid_key);
    this._set_custom_config_property(
      "service_worker_file",
      config_keys?.sw_file_name
    );
  }

  set_super_properties(props = {}) {
    let existing_super_properties = utils.get_parsed_local_store_data(
      constants.super_properties_key
    );
    let new_super_props = { ...existing_super_properties, ...props };
    let formatted_super_props = {};
    for (let key in new_super_props) {
      if (!utils.has_special_char(key)) {
        formatted_super_props[key] = new_super_props[key];
      }
    }
    utils.set_local_storage_item(
      constants.super_properties_key,
      JSON.stringify(formatted_super_props)
    );
    suprSendInstance.env_properties = {
      ...suprSendInstance.env_properties,
      ...formatted_super_props,
    };
  }

  identify(unique_id) {
    if (!suprSendInstance._user_identified) {
      utils.batch_or_call({
        env: config.env_key,
        event: "$identify",
        $insert_id: utils.uuid(),
        $time: utils.epoch_milliseconds(),
        properties: {
          $identified_id: unique_id,
          $anon_id: suprSendInstance.distinct_id,
        },
      });
      utils.set_cookie(constants.distinct_id, unique_id);
      suprSendInstance.distinct_id = unique_id;
      suprSendInstance._user_identified = true;
      this.web_push.update_subscription();
      this.track(internal_events.user_login);
    }
  }

  track(event, props = {}) {
    if (event === undefined) {
      return;
    } else if (
      !utils.is_internal_event(event) &&
      utils.has_special_char(event)
    ) {
      console.log("SuprSend: key cannot start with $ or ss_");
      return;
    }
    const super_props = utils.get_parsed_local_store_data(
      constants.super_properties_key
    );
    const formatted_data = utils.format_props({ key: props });
    const final_data = {
      ...formatted_data,
      ...suprSendInstance.env_properties,
      ...super_props,
      $current_url: window.location.href,
    };
    utils.batch_or_call({
      event: String(event),
      distinct_id: suprSendInstance.distinct_id,
      env: config.env_key,
      properties: final_data,
      $insert_id: utils.uuid(),
      $time: utils.epoch_milliseconds(),
    });
  }

  purchase_made(props) {
    this.track(internal_events.purchase_made, props);
  }

  async reset(options = { unsubscribe_push: true }) {
    // unsubscribe push
    if (options?.unsubscribe_push) {
      const subscription = await this.web_push._get_subscription_without_wait();
      if (subscription) {
        this.user.remove_webpush(subscription);
      }
    }
    this.track(internal_events.user_logout);
    var distinct_id = utils.uuid();
    utils.set_cookie(constants.distinct_id, distinct_id);
    suprSendInstance = {
      distinct_id: distinct_id,
      _user_identified: false,
    };
    utils.remove_local_storage_item(constants.super_properties_key);
    this.user = new User(suprSendInstance, this.emitter);
    this.web_push = new WebPush(suprSendInstance);
    SuprSend._set_env_properties();
  }
}

export default new SuprSend();
