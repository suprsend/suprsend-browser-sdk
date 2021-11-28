import utils from "./utils";
import config from "./config";
import { parsePhoneNumber } from "libphonenumber-js";

class User {
  constructor(instance) {
    this.instance = instance;
  }

  _call_indentity(properties) {
    utils.batch_or_call({
      env: config.env_key,
      distinct_id: this.instance.distinct_id,
      ...properties,
    });
  }

  set(key, value) {
    const body = utils.format_props(key, value);
    if (body) {
      this._call_indentity({ $set: body });
    }
  }

  set_once(key, value) {
    const body = utils.format_props(key, value);
    if (body) {
      this._call_indentity({ $set_once: body });
    }
  }

  increment(key, value = 1) {
    const body = utils.format_props(key, value);
    if (body) {
      let keys_list = Object.keys(body);
      for (let i = 0; i < keys_list.length; i++) {
        const key_value = keys_list[i];
        const is_number = Number(body[key_value]);
        if (!is_number) {
          delete body[key_value];
        }
      }
      this._call_indentity({ $add: body });
    }
  }

  append(key, value) {
    const body = utils.format_props(key, value);
    if (body) {
      this._call_indentity({ $append: body });
    }
  }

  remove(key, value) {
    const body = utils.format_props(key, value);
    if (body) {
      this._call_indentity({ $remove: body });
    }
  }

  unset(key) {
    let formatted_data;
    if (typeof key === "string" && !has_special_char(key)) {
      formatted_data = [String(key)];
    } else if (key instanceof Array) {
      formatted_data = [];
      key.forEach((item) => {
        if (!utils.has_special_char(item)) {
          formatted_data.push(String(item));
        }
      });
    } else {
      return;
    }
    this._call_indentity({ $unset: formatted_data });
  }

  add_email(email = "") {
    this.append("$email", email);
  }

  remove_email(email = "") {
    this.remove("$email", email);
  }

  add_sms(mobile = "") {
    try {
      const mobile_number = parsePhoneNumber(mobile);
      if (mobile_number.isValid()) {
        this.append("$sms", mobile);
      } else {
        console.log("Suprsend: Provide valid Mobile number");
      }
    } catch (err) {
      console.log("Suprsend: Provide valid Mobile number");
    }
  }

  remove_sms(mobile = "") {
    this.remove("$sms", mobile);
  }

  add_whatsapp(mobile = "") {
    try {
      const mobile_number = parsePhoneNumber(mobile);
      if (mobile_number.isValid()) {
        this.append("$whatsapp", mobile);
      } else {
        console.log("Suprsend: Provide valid Mobile number");
      }
    } catch (err) {
      console.log("Suprsend: Provide valid Mobile number");
    }
  }

  remove_sms(mobile = "") {
    this.remove("$whatsapp", mobile);
  }

  add_webpush(push = "") {
    this.append({
      $webpush: push,
      $device_id: this.instance?.env_properties?.$device_id,
    });
  }
}

export default User;
