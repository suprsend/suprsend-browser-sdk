import utils, { timerID } from "./utils";
import config from "./config";
import User from "./user";
import { constants } from "./constants";

var suprSendInstance;

window.addEventListener("load", () => {
  if (timerID) {
    clearTimeout(timerID);
    setTimeout(() => {
      utils.bulk_call_api(true);
    }, 2000);
  }
});

window.addEventListener("online", () => {
  if (timerID) {
    clearTimeout(timerID);
    setTimeout(() => {
      utils.bulk_call_api(true);
    }, 2000);
  }
});

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

  initialize(ENV_API_KEY) {
    var distinct_id = utils.get_cookie(constants.distinct_id);
    if (!suprSendInstance) {
      suprSendInstance = { ENV_API_KEY: ENV_API_KEY };
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
      utils.call_api({
        env: suprSendInstance.ENV_API_KEY,
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
    if (event != undefined) {
      const formatted_data = utils.format_props({
        ...props,
        ...suprSendInstance.env_properties,
        current_url: window.location.href,
        insert_id: utils.uuid(),
        time: utils.epoch_seconds(),
      });
      utils.call_api({
        event: String(event),
        distinct_id: suprSendInstance.distinct_id,
        env: suprSendInstance.ENV_API_KEY,
        properties: formatted_data,
      });
    }
  }

  reset() {
    var distinct_id = utils.uuid();
    utils.set_cookie(constants.distinct_id, distinct_id);
    suprSendInstance = {
      env: suprSendInstance.ENV_API_KEY,
      distinct_id: distinct_id,
    };
    this.user = new User(suprSendInstance);
    SuprSend.setEnvProperties();
  }
}

export default new SuprSend();
