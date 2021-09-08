import utils from "./utils";

class User {
  constructor(instance) {
    this.instance = instance;
  }

  _call_indetity(properties) {
    utils.call_api("identity/", {
      env: this.instance.ENV_API_KEY,
      distinct_id: this.instance.distinct_id,
      ...properties,
    });
  }

  set(key, value) {
    const body = utils.format_props(key, value);
    if (body) {
      this._call_indetity({ $set: body });
    }
  }

  set_once(key, value) {
    const body = utils.format_props(key, value);
    if (body) {
      this._call_indetity({ $set_once: body });
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
      this._call_indetity({ $add: body });
    }
  }

  append(key, value) {
    const body = utils.format_props(key, value);
    if (body) {
      this._call_indetity({ $append: body });
    }
  }

  remove(key, value) {
    const body = utils.format_props(key, value);
    if (body) {
      this._call_indetity({ $remove: body });
    }
  }

  unset(key) {
    let formatted_data;
    if (typeof key === "string") {
      formatted_data = [String(key)];
    } else if (key instanceof Array) {
      formatted_data = key.map((item) => String(item));
    } else {
      return;
    }
    this._call_indetity({ $unset: formatted_data });
  }

  add_email(email = "") {
    this.append("email", email);
  }

  remove_email(email = "") {
    this.remove("email", email);
  }

  add_sms(mobile = "") {
    this.append("sms", mobile);
  }

  add_whatsapp(mobile = "") {
    this.append("whatsapp", mobile);
  }
}

export default User;
