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
        ENV: this.instance.ENV_API_Key,
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
        ENV: this.instance.ENV_API_Key,
        $set_once: {
          ...body,
        },
      });
    }
  }

  increment() {}

  append() {}

  remove() {}

  unset() {}
}

export default User;
