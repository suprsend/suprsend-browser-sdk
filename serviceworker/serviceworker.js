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

function safe_get(cb, default_value) {
  var resp;
  try {
    resp = cb();
  } catch (err) {
    resp = default_value;
  }
  return resp;
}

var suprsend_config = {
  api_url: "https://hub.suprsend.com",
  imgkit_root: "https://ik.imagekit.io/l0quatz6utm/",
  api_events_route: "event/",
  workspace_key: "",
};

var valid_notification_params = [
  "title",
  "body",
  "icon",
  "image",
  "badge",
  "vibrate",
  "sound",
  "dir",
  "tag",
  "data",
  "requireInteraction",
  "renotify",
  "silent",
  "timestamp",
  "actions",
];

var url_fields = ["image", "icon", "badge"];

function init_workspace(key, url) {
  suprsend_config.workspace_key = key;
  if (url) {
    suprsend_config.api_url = url;
  }
}

function validate_notification(notification_obj) {
  var validated_notification_obj = {};
  for (var item in notification_obj) {
    if (valid_notification_params.includes(item)) {
      if (
        url_fields.includes(item) &&
        notification_obj[item] &&
        !notification_obj[item].startsWith("http")
      ) {
        validated_notification_obj[
          item
        ] = `${suprsend_config.imgkit_root}${notification_obj[item]}`;
      } else {
        validated_notification_obj[item] = notification_obj[item];
      }
    }
  }
  if (!(validated_notification_obj["actions"] instanceof Array)) {
    delete validated_notification_obj["actions"];
  }
  return validated_notification_obj;
}

function call_ss_api(body, method = "post") {
  var requested_date = new Date().toGMTString();
  var authorization = suprsend_config.workspace_key + ":";
  return fetch(
    `${suprsend_config.api_url}/${suprsend_config.api_events_route}`,
    {
      method: method,
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        Authorization: authorization,
        "x-amz-date": requested_date,
      },
    }
  );
}

function send_notification_event(event_name, event_properties) {
  call_ss_api({
    event: event_name,
    env: suprsend_config.workspace_key,
    $insert_id: uuid(),
    $time: epoch_milliseconds(),
    properties: event_properties,
  });
}

self.addEventListener("push", function (e) {
  var notification = e.data.json();
  var validated_notification = validate_notification(notification);
  send_notification_event("$notification_delivered", {
    id: safe_get(() => validated_notification.data.notification_id),
  });
  e.waitUntil(
    self.registration.showNotification(
      validated_notification.title || "",
      validated_notification
    )
  );
});

self.addEventListener("notificationclose", function (e) {
  var notification = e.notification;
  send_notification_event("$notification_dismiss", {
    id: safe_get(() => notification.data.notification_id),
  });
});

self.addEventListener("notificationclick", function (e) {
  e.notification.close();
  var notification = e.notification;
  send_notification_event("$notification_clicked", {
    id: safe_get(() => notification.data.notification_id),
    label_id: e.action,
  });
  var launch_url_obj = safe_get(() => notification.data.launch_urls);
  var redirect_url = "/";
  if (launch_url_obj) {
    if (e.action && launch_url_obj[e.action]) {
      redirect_url = launch_url_obj[e.action];
    } else if (launch_url_obj["default"]) {
      redirect_url = launch_url_obj["default"];
    }
  } else {
    redirect_url = "/";
  }
  clients.openWindow(redirect_url);
});
