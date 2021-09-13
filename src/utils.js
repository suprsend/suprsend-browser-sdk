import {
  browser_useragent_map,
  browser_version_useragent_map,
  os_useragent_map,
  constants,
} from "./constants";
import config from "./config";

export let timerID;

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
  return !!window.localStorage;
}

function get_local_storage_item(key) {
  return localStorage.getItem(key);
}

function set_local_storage_item(key, value) {
  localStorage.setItem(key, value);
}

function remove_local_storage_item(key) {
  localStorage.removeItem(key);
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
}

function browser_version() {
  const userAgent = navigator.userAgent;
  const browser_name = browser();
  const regex = browser_version_useragent_map[browser_name];
  if (regex) {
    const result = userAgent.match(regex);
    if (result && result.length > 1) {
      return result[1];
    }
  }
}

function os() {
  const userAgent = navigator.userAgent;
  for (let i in os_useragent_map) {
    if (userAgent.indexOf(os_useragent_map[i]) >= 0) {
      return i;
    }
  }
}

function get_bulk_events() {
  let data = get_local_storage_item(constants.bulk_events_key) || "[]";
  data = JSON.parse(data);
  return data;
}

function api(route, body, method = "post") {
  return fetch(`${config.api_url}/${route}`, {
    method: method,
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

function bulk_call_api(handleCatch = false) {
  const items = get_bulk_events();
  if (items.length) {
    const batch = items.slice(0, 20);
    api(constants.api_events_route, batch)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Error in Fetch");
        }
        let items = get_bulk_events();
        items.splice(0, 20);
        set_local_storage_item(
          constants.bulk_events_key,
          JSON.stringify(items)
        );
        bulk_call_api();
      })
      .catch(() => {
        if (handleCatch) {
          handle_event_timer();
        }
      });
  }
}

function call_api(body, route = constants.api_events_route) {
  return api(route, body).catch(() => {
    let parsed_data = get_bulk_events();
    parsed_data?.push(body);
    set_local_storage_item(
      constants.bulk_events_key,
      JSON.stringify(parsed_data)
    );
    handle_event_timer();
  });
}

function handle_event_timer() {
  if (!timerID) {
    timerID = setInterval(() => {
      const items = get_bulk_events();
      if (items.length) {
        bulk_call_api();
      } else {
        clearInterval(timerID);
      }
    }, 2 * 60 * 1000);
  }
}

function format_props(key, value) {
  var formatted_data;
  if (key instanceof Object) {
    formatted_data = {};
    let keys_list = Object.keys(key);
    for (let i = 0; i < keys_list.length; i++) {
      const value = keys_list[i];
      if (key[value] !== undefined) {
        formatted_data[String(value)] = key[value];
      }
    }
  } else if (value != undefined) {
    formatted_data = { [String(key)]: value };
  }
  return formatted_data;
}

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
  call_api,
  bulk_call_api,
  format_props,
};
