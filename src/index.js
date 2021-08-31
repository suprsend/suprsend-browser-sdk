import utils from "./utils";
import config from "./config";
import User from "./user";
import { constants } from "./constants";

var suprSendInstance;

class SuprSend {
  static setEnvProperties() {
    suprSendInstance.env_properties = {
      os: utils.os(),
      browser: utils.browser(),
      browser_version: utils.browser_version(),
      sdk_type: "Browser",
      sdk_version: config.sdk_version,
    };
  }

  initialize(ENV_API_Key) {
    var distinct_id = utils.get_cookie(constants.distinct_id);
    if (!suprSendInstance) {
      suprSendInstance = { ENV_API_Key: ENV_API_Key };
    }
    if (!distinct_id) {
      distinct_id = utils.uuid();
      utils.set_cookie(constants.distinct_id, distinct_id);
    }
    suprSendInstance.distinct_id = distinct_id;
    this.user = new User(suprSendInstance);
    SuprSend.setEnvProperties();
  }

  identify(unique_id) {
    if (!suprSendInstance._user_identified) {
      config.call_api("identity/", {
        ENV_API_Key: suprSendInstance.ENV_API_Key,
        event: "$identify",
        properties: {
          identified_id: unique_id,
          anon_id: suprSendInstance.distinct_id,
        },
      });
    }
    utils.set_cookie(constants.distinct_id, unique_id);
    suprSendInstance.distinct_id = unique_id;
    suprSendInstance._user_identified = true;
  }

  track(event, props = {}) {
    config.call_api("event/", {
      event: event,
      distinct_id: suprSendInstance.distinct_id,
      ENV: suprSendInstance.ENV_API_Key,
      properties: {
        ...props,
        ...suprSendInstance.env_properties,
        current_url: window.location.href,
        insert_id: utils.uuid(),
        time: utils.epoch_seconds(),
      },
    });
  }

  reset() {
    var distinct_id = utils.uuid();
    utils.set_cookie(constants.distinct_id, distinct_id);
    suprSendInstance = {
      ENV_API_Key: suprSendInstance.ENV_API_Key,
      distinct_id: distinct_id,
    };
    this.user = new User(suprSendInstance);
    SuprSend.setEnvProperties();
  }
}

export default new SuprSend();
