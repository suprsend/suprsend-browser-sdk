import utils from "./utils";

class User {
  constructor(instance) {
    this.instance = instance;
  }

  check_props(key, value) {
    var body;
    if (typeof key === "string") {
      body = { [key]: value };
    } else if (key instanceof Object) {
      body = key;
    }
    return body;
  }

  set(key, value) {
    const body = this.check_props(key, value);
    if (body) {
      utils.call_api("identity/", {
        distinct_id: this.instance.distinct_id,
        env: this.instance.ENV_API_KEY,
        $set: {
          ...body,
        },
      });
    }
  }

  set_once(key, value) {
    const body = this.check_props(key, value);
    if (body) {
      utils.call_api("identity/", {
        distinct_id: this.instance.distinct_id,
        env: this.instance.ENV_API_KEY,
        $set_once: {
          ...body,
        },
      });
    }
  }

  increment(key, value) {
    const body = this.check_props(key, value);
    if (body) {
      utils.call_api("identity/", {
        distinct_id: this.instance.distinct_id,
        env: this.instance.ENV_API_KEY,
        $add: {
          ...body,
        },
      });
    }
  }

  append(key, value) {
    utils.call_api("identity/", {
      distinct_id: this.instance.distinct_id,
      env: this.instance.ENV_API_KEY,
      $append: {
        [key]: value,
      },
    });
  }

  remove(key, value) {
    utils.call_api("identity/", {
      distinct_id: this.instance.distinct_id,
      env: this.instance.ENV_API_KEY,
      $remove: {
        [key]: value,
      },
    });
  }

  unset(key) {
    utils.call_api("identity/", {
      distinct_id: this.instance.distinct_id,
      env: this.instance.ENV_API_KEY,
      $unset: [key],
    });
  }

  addEmail(email) {
    this.append("email", email);
  }

  removeEmail(email) {
    this.remove("email", email);
  }

  addSMS(mobile) {
    this.append("sms", mobile);
  }

  addWhatsApp(mobile) {
    this.append("whatsapp", mobile);
  }
}

export default User;
