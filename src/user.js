import utils from "./utils";

class User {
  constructor(instance) {
    this.instance = instance;
  }

  _call_indetity(properties) {
    utils.call_api("/identity", {
      env: this.instance.ENV_API_KEY,
      distinct_id: this.instance.distinct_id,
      event: "$identify",
      ...properties,
    });
  }

  _check_props(key, value) {
    var body;
    if (typeof key === "string") {
      body = { [key]: value };
    } else if (key instanceof Object) {
      body = key;
    }
    return body;
  }

  set(key, value) {
    const body = this._check_props(key, value);
    if (body) {
      this._call_indetity({
        $set: {
          ...body,
        },
      });
    }
  }

  set_once(key, value) {
    const body = this._check_props(key, value);
    if (body) {
      this._call_indetity({
        $set_once: {
          ...body,
        },
      });
    }
  }

  increment(key, value = 1) {
    const body = this._check_props(key, value);
    if (body) {
      let keys_list = Object.keys(body);
      for (let i = 0; i < keys_list.length; i++) {
        const key_value = keys_list[i];
        const is_number = Number(body[key_value]);
        if (!is_number) {
          delete body[key_value];
        }
      }
      this._call_indetity({
        $add: {
          ...body,
        },
      });
    }
  }

  append(key = "", value) {
    if (value != undefined) {
      this._call_indetity({
        $append: {
          [String(key)]: value,
        },
      });
    }
  }

  remove(key, value) {
    if (value != undefined) {
      this._call_indetity({
        $remove: {
          [String(key)]: value,
        },
      });
    }
  }

  unset(key = "") {
    this._call_indetity({
      $unset: [String(key)],
    });
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
