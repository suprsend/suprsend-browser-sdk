import utils from "./utils";
import config from "./config";
import User from "./user";
import { initCalledAt } from "./index";

var notification_timer;
class WebPush {
  constructor(instance) {
    this.instance = instance;
    this.user = new User(instance);
  }

  _check_push_support = () => {
    return !!("serviceWorker" in navigator && "PushManager" in window);
  };

  _ask_notification_permission = async () =>
    await Notification.requestPermission();

  _register_sw = () => {
    return navigator.serviceWorker
      .register(`/${config.service_worker_file}`)
      .then((registration) => {
        console.log("Service worker successfully registered.");
        this._subscribe_push(registration);
      })
      .catch((err) => {
        console.error("Unable to register service worker.", err);
      });
  };

  _get_subscription = () => {
    return navigator.serviceWorker.ready
      .then((registration) => {
        return registration.pushManager.getSubscription();
      })
      .then(async (subscription) => {
        if (!subscription) {
          return;
        }
        return subscription;
      });
  };

  // this method make sure there is a given delay, as calling notification permission just after load is not good UX practice
  _subscribe_with_delay() {
    const now = new Date();
    const delay = now - initCalledAt;
    const has_delay = delay >= config.sw_delay;
    if (has_delay) {
      this._register_sw();
    } else {
      clearTimeout(notification_timer);
      notification_timer = setTimeout(() => {
        this._register_sw();
      }, config.sw_delay - delay);
    }
  }

  // 1. ask permission.
  // 2. if permission is granted then check if its already subscribed.
  // 3. if not subscribed already then subscribe to push.
  _subscribe_push = async (reg) => {
    const permission = await this._ask_notification_permission();
    if (permission === "granted") {
      const subscription = await this._get_subscription();
      if (!subscription) {
        if (!config.vapid_key) {
          console.log("Provide vapid key while calling init");
          return;
        }
        const applicationServerKey = utils.urlB64ToUint8Array(config.vapid_key);
        const subscription = await reg.pushManager.subscribe({
          applicationServerKey,
          userVisibleOnly: true,
        });
        this.user.add_webpush(subscription);
      } else {
        console.log("Push already subscribed");
      }
    }
  };

  update_subscription() {
    navigator?.serviceWorker?.ready
      .then((registration) => {
        return registration.pushManager.getSubscription();
      })
      .then((subscription) => {
        if (!subscription) {
          return;
        }
        this.user.add_webpush(subscription);
      });
  }

  register_push = () => {
    if (this._check_push_support()) {
      this._subscribe_with_delay();
    } else {
      console.log("OOPS, Web Push isn't supported");
    }
  };

  is_subscribed = async () => {
    const subscription = await this._get_subscription();
    return !!subscription;
  };

  // unsubscribe_push = () => {
  //   navigator.serviceWorker.ready
  //     .then((registration) => {
  //       return registration.pushManager.getSubscription();
  //     })
  //     .then((subscription) => {
  //       return subscription.unsubscribe().then(() => {
  //         console.log("API_CALL: unsubscription");
  //       });
  //     });
  // };
}

export default WebPush;
