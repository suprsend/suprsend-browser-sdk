import utils from "./utils";
import config from "./config";
import User from "./user";
import ServiceWorker from "./service_worker";
import { constants } from "./constants";
import { SSConfigurationError } from "./errors";

var suprSendInstance;
export var init_at;

class SuprSend {
  init(ENV_API_KEY, SIGNING_KEY, config_keys = {}) {
    config_keys.env = ENV_API_KEY;
    config_keys.signing_key = SIGNING_KEY;
    init_at = new Date();
    var distinct_id = utils.get_cookie(constants.distinct_id);
    if (!suprSendInstance) {
      suprSendInstance = {};
      this.setCustomConfig(config_keys);
    }
    if (!distinct_id) {
      distinct_id = utils.uuid();
      utils.set_cookie(constants.distinct_id, distinct_id);
    }
    suprSendInstance.distinct_id = distinct_id;
    this.user = new User(suprSendInstance);
    this.sw = new ServiceWorker(suprSendInstance);
    this.sw.update_subscription();
    SuprSend.setEnvProperties();
    utils.bulk_call_api();
  }

  static setEnvProperties() {
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

  setCustomConfigProperty(key, value = "", mandatory = false) {
    if (value) {
      config[key] = value;
    } else {
      if (mandatory) {
        throw new SSConfigurationError(`Mandatory Key Missing: ${key}`);
      }
    }
  }

  setCustomConfig(config_keys) {
    this.setCustomConfigProperty("env_key", config_keys.env, true);
    this.setCustomConfigProperty("signing_key", config_keys.signing_key, true);
    this.setCustomConfigProperty("api_url", config_keys?.api_url);
    this.setCustomConfigProperty("vapid_key", config_keys?.vapid_key);
    this.setCustomConfigProperty(
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
        properties: {
          $identified_id: unique_id,
          $anon_id: suprSendInstance.distinct_id,
        },
      });
      utils.set_cookie(constants.distinct_id, unique_id);
      suprSendInstance.distinct_id = unique_id;
      suprSendInstance._user_identified = true;
      this.sw.update_subscription();
    }
  }

  track(event, props = {}) {
    if (event === undefined) {
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

  reset() {
    var distinct_id = utils.uuid();
    utils.set_cookie(constants.distinct_id, distinct_id);
    suprSendInstance = {
      distinct_id: distinct_id,
      _user_identified: false,
    };
    utils.remove_local_storage_item(constants.super_properties_key);
    this.user = new User(suprSendInstance);
    this.sw = new ServiceWorker(suprSendInstance);
    SuprSend.setEnvProperties();
  }
}

export default new SuprSend();
