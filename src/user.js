import utils from "./utils";
import config from "./config";
import { regex, constants } from "./constants";
import Preferences from "./preferences";

class User {
  constructor(instance, emitter) {
    this.instance = instance;
    this.preferences = new Preferences(this.instance, emitter);
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
      if (regex.mobile.test(mobile)) {
        this.append(key, mobile);
      } else {
        console.log(
          "SuprSend: Provide valid Mobile number as per E.164 standard"
        );
      }
    } catch (err) {
      console.log(
        "SuprSend: Provide valid Mobile number as per E.164 standard"
      );
    }
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
}

export default User;
