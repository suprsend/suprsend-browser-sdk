import {
  browser_useragent_map,
  browser_version_useragent_map,
  os_useragent_map,
} from "./constants";

// suprsend sdk related util functions
const utils = {
  uuid: function () {
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
  },
  epoch_seconds: function () {
    return Math.round(Date.now() / 1000);
  },

  // cookie related functions
  cookie_permission: function () {
    return navigator.cookieEnabled;
  },
  set_cookie: function (name, value, days = 365) {
    var expires = "";
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
  },
  get_cookie: function (name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(";");
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  },
  remove_cookie: function (name) {
    document.cookie =
      name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
  },

  // local storage related functions
  localStorage_permission: function () {
    return !!window.localStorage;
  },

  browser: function () {
    const userAgent = navigator.userAgent;
    for (let browser_item in browser_useragent_map) {
      for (let str of browser_useragent_map[browser_item]) {
        if (userAgent.indexOf(str) >= 0) {
          return browser_item;
        }
      }
    }
  },
  browser_version: function () {
    const userAgent = navigator.userAgent;
    const browser = utils.browser();
    const regex = browser_version_useragent_map[browser];
    if (regex) {
      const result = userAgent.match(regex);
      if (result && result.length > 1) {
        return result[1];
      }
    }
  },
  os: function () {
    const userAgent = navigator.userAgent;
    for (let i in os_useragent_map) {
      if (userAgent.indexOf(os_useragent_map[i]) >= 0) {
        return i;
      }
    }
  },
};

export default utils;
