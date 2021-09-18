import utils from "./utils";
import config from "./config";
import User from "./user";
import { constants } from "./constants";

var suprSendInstance;

class SuprSend {
  static ENV_API_KEY;

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

  initialize(ENV_API_KEY) {
    var distinct_id = utils.get_cookie(constants.distinct_id);
    if (!suprSendInstance) {
      SuprSend.ENV_API_KEY = ENV_API_KEY;
      suprSendInstance = {};
    }
    if (!distinct_id) {
      distinct_id = utils.uuid();
      utils.set_cookie(constants.distinct_id, distinct_id);
    }
    suprSendInstance.distinct_id = distinct_id;
    this.user = new User(SuprSend.ENV_API_KEY, suprSendInstance);
    SuprSend.setEnvProperties();
    utils.bulk_call_api();
  }

  set_super_properties(props = {}) {
    let existing_super_properties = utils.get_parsed_local_store_data(
      constants.super_properties_key
    );
    let new_super_props = { ...existing_super_properties, ...props };
    utils.set_local_storage_item(
      constants.super_properties_key,
      JSON.stringify(new_super_props)
    );
    suprSendInstance.env_properties = {
      ...suprSendInstance.env_properties,
      ...new_super_props,
    };
  }

  identify(unique_id) {
    if (!suprSendInstance._user_identified) {
      utils.batch_or_call({
        env: SuprSend.ENV_API_KEY,
        event: "$identify",
        properties: {
          $identified_id: unique_id,
          $anon_id: suprSendInstance.distinct_id,
        },
      });
      utils.set_cookie(constants.distinct_id, unique_id);
      suprSendInstance.distinct_id = unique_id;
      suprSendInstance._user_identified = true;
    }
  }

  track(event, props = {}) {
    if (event != undefined) {
      const super_props = utils.get_parsed_local_store_data(
        constants.super_properties_key
      );
      const formatted_data = utils.format_props({
        ...props,
        ...suprSendInstance.env_properties,
        ...super_props,
        $current_url: window.location.href,
      });
      utils.batch_or_call({
        event: String(event),
        distinct_id: suprSendInstance.distinct_id,
        env: SuprSend.ENV_API_KEY,
        properties: formatted_data,
        $insert_id: utils.uuid(),
        $time: utils.epoch_milliseconds(),
      });
    }
  }

  reset() {
    var distinct_id = utils.uuid();
    utils.set_cookie(constants.distinct_id, distinct_id);
    suprSendInstance = {
      distinct_id: distinct_id,
      _user_identified: false,
    };
    utils.remove_local_storage_item(constants.super_properties_key);
    this.user = new User(SuprSend.ENV_API_KEY, suprSendInstance);
    SuprSend.setEnvProperties();
  }
}

export default new SuprSend();
