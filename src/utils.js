import {
  browser_useragent_map,
  browser_version_useragent_map,
  os_useragent_map,
  constants,
} from "./constants";
import config from "./config";
import create_signature from "./encryption";

function uuid() {
  var dt = new Date().getTime();
  var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    function (c) {
      var r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
    }
  );
  return uuid;
}

function epoch_milliseconds() {
  return Math.round(Date.now());
}

function cookie_enabled() {
  return navigator.cookieEnabled;
}

function set_cookie(name, value, days = 365) {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function get_cookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

function remove_cookie(name) {
  document.cookie = name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
}

function local_storage_enabled() {
  let enabled = true;
  try {
    !!window.localStorage;
  } catch (err) {
    enabled = false;
  }
  return enabled;
}

function get_local_storage_item(key) {
  if (local_storage_enabled()) {
    return localStorage.getItem(key);
  }
}

function set_local_storage_item(key, value) {
  if (local_storage_enabled()) {
    localStorage.setItem(key, value);
  }
}

function remove_local_storage_item(key) {
  if (local_storage_enabled()) {
    localStorage.removeItem(key);
  }
}

function get_parsed_local_store_data(key, default_value = {}) {
  let existing_data = get_local_storage_item(key);
  existing_data = existing_data ? JSON.parse(existing_data) : default_value;
  return existing_data;
}

function browser() {
  const userAgent = navigator.userAgent;
  for (let browser_item in browser_useragent_map) {
    for (let str of browser_useragent_map[browser_item]) {
      if (userAgent.indexOf(str) >= 0) {
        return browser_item;
      }
    }
  }
  return "";
}

function browser_version() {
  const userAgent = navigator.userAgent;
  const browser_name = browser();
  for (let regex_item of browser_version_useragent_map[browser_name]) {
    const regex = regex_item;
    if (regex) {
      const result = userAgent.match(regex);
      if (result && result.length > 1) {
        return result[1];
      }
    }
  }
  return "";
}

function os() {
  const userAgent = navigator.userAgent;
  for (let i in os_useragent_map) {
    if (userAgent.indexOf(os_useragent_map[i]) >= 0) {
      return i;
    }
  }
  return "";
}

async function api(route, body, method = "POST") {
  const requested_date = new Date().toGMTString();
  const req_body = JSON.stringify(body);
  const sign = await create_signature(req_body, requested_date, "POST");
  const authorization = sign ? `${config.env_key}:${sign}` : config.env_key;
  return fetch(`${config.api_url}/${route}`, {
    method: method,
    body: req_body,
    headers: {
      "Content-Type": "application/json",
      Authorization: authorization,
      "x-amz-date": requested_date,
    },
  });
}

/* 
1. get data from local storage
2. if data is present create first batch data and call api else schedule next flush
3. if the above api call is success call next api call with next set of data if it exists
4. If there is any error in api call then schedule flush after 2min
*/
function bulk_call_api() {
  const items = get_parsed_local_store_data(constants.bulk_events_key, []);
  if (items.length) {
    const batch = items.slice(0, config.batch_size);
    api(constants.api_events_route, batch)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Error in Fetch");
        }
        let items = get_parsed_local_store_data(constants.bulk_events_key, []);
        items.splice(0, config.batch_size);
        set_local_storage_item(
          constants.bulk_events_key,
          JSON.stringify(items)
        );
        bulk_call_api();
      })
      .catch(() => {
        schedule_flush(2 * 60 * 1000);
      });
  } else {
    schedule_flush();
  }
}

/* 
 schedule the flush in some time future
 */
function schedule_flush(delay = 5000) {
  setTimeout(() => {
    bulk_call_api();
  }, delay);
}

/* 
local storage enabled => add it to local storage which will be picked by continuous flusher
local storage disabled => call the api directly
*/
function batch_or_call(body) {
  if (local_storage_enabled()) {
    let parsed_data = get_parsed_local_store_data(
      constants.bulk_events_key,
      []
    );
    parsed_data?.push(body);
    set_local_storage_item(
      constants.bulk_events_key,
      JSON.stringify(parsed_data)
    );
  } else {
    api(constants.api_events_route, body);
  }
}

function format_props({ key, value, allow_special_tags = false }) {
  var formatted_data;
  if (key instanceof Object) {
    formatted_data = {};
    for (let item in key) {
      if (key[item] !== undefined) {
        if (!allow_special_tags && has_special_char(item)) {
          continue;
        }
        formatted_data[String(item)] = key[item];
      }
    }
  } else if (value != undefined) {
    if (!allow_special_tags && has_special_char(String(key))) {
      console.log("Suprsend: key cannot start with $ or ss_");
      return;
    }
    formatted_data = { [String(key)]: value };
  }
  return formatted_data;
}

function urlB64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

const has_special_char = (str) => {
  return str.startsWith("$") || str?.toLowerCase()?.startsWith("ss_");
};

const is_empty = (value) => {
  if (Array.isArray(value)) {
    return value.length === 0;
  } else if (value instanceof Object) {
    return Object.keys(value).length === 0;
  } else {
    const empty_values = ["", null, undefined];
    return empty_values.includes(value);
  }
};

export default {
  uuid,
  epoch_milliseconds,
  cookie_enabled,
  set_cookie,
  get_cookie,
  remove_cookie,
  local_storage_enabled,
  get_local_storage_item,
  set_local_storage_item,
  remove_local_storage_item,
  get_parsed_local_store_data,
  browser,
  browser_version,
  os,
  schedule_flush,
  format_props,
  urlB64ToUint8Array,
  batch_or_call,
  has_special_char,
  is_empty,
};
