var suprsend_config = {
  api_url: "https://collector-staging.suprsend.workers.dev",
  imgkit_root: "https://ik.imagekit.io/l0quatz6utm/",
  api_events_route: "event/",
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

const url_fields = ["image", "icon", "badge"];

function safe_get(cb, default_value) {
  let resp;
  try {
    resp = cb();
  } catch (err) {
    resp = default_value;
  }
  return resp;
}

function validate_notification(notification_obj) {
  let validated_notification_obj = {};
  for (var item in notification_obj) {
    if (valid_notification_params.includes(item)) {
      if (url_fields.includes(item)) {
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

function track_data(body, method = "post") {
  return fetch(
    `${suprsend_config.api_url}/${suprsend_config.api_events_route}`,
    {
      method: method,
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    }
  );
}

self.addEventListener("push", function (e) {
  var notification = e.data.json();
  const validated_notification = validate_notification(notification);
  console.log("Received notification", validated_notification);
  track_data({
    event: "$notification_delivered",
    properties: {
      id: safe_get(() => validated_notification.data.notification_id),
    },
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
  console.log("Closed notification", notification);
  track_data({
    event: "$notification_dismiss",
    properties: {
      id: safe_get(() => notification.data.notification_id),
    },
  });
});

self.addEventListener("notificationclick", function (e) {
  e.notification.close();
  var notification = e.notification;
  console.log("Clicked notification", notification);
  track_data({
    event: "$notification_clicked",
    properties: {
      id: safe_get(() => notification.data.notification_id),
      label_id: e.action,
    },
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
