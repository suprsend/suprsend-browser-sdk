import utils from "./utils";
import config from "./config";
import { constants } from "./constants";

// api calls function
function call_api(route, body, method = "post") {
  fetch(`${config.api_url}/${route}`, {
    method: method,
    body: JSON.stringify(body),
  })
    .then(() => console.log("success"))
    .catch((err) => console.log("error occured", err));
}

// initializing supersend library function
function SuprSend() {}
var suprSendInstance;

function create_instance(ENV_API_Key) {
  var distinct_id = utils.get_cookie(constants.distinct_id);
  if (!suprSendInstance) {
    suprSendInstance = { ENV_API_Key: ENV_API_Key };
  }
  if (!distinct_id) {
    distinct_id = utils.uuid();
    utils.set_cookie(constants.distinct_id, distinct_id);
  }
  suprSendInstance.distinct_id = distinct_id;
  SuprSend.setEnvProperties();
  return suprSendInstance;
}

SuprSend.setEnvProperties = function () {
  suprSendInstance.env_properties = {
    os: utils.os(),
    browser: utils.browser(),
    browser_version: utils.browser_version(),
    sdk_type: "Browser",
    sdk_version: config.sdk_version,
  };
};

SuprSend.prototype.initialize = function (ENV_API_Key) {
  create_instance(ENV_API_Key);
};

SuprSend.prototype.identify = function (unique_id) {
  if (!suprSendInstance._user_identified) {
    call_api("identify/", {
      ENV_API_Key: suprSendInstance.ENV_API_Key,
      event: "$identify",
      properties: {
        identified_id: unique_id,
        anon_id: suprSendInstance.distinct_id,
      },
    });
  }
  suprSendInstance._user_identified = true;
};

SuprSend.prototype.track = function (event, props = {}) {
  call_api("event/", {
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
};

export default new SuprSend();
