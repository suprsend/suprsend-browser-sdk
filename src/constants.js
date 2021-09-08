// suprsend sdk related constants
export const constants = {
  distinct_id: "_suprsend_dist_id",
  bulk_events_key: "bulk_api_call",
  api_events_route: "event/",
};

export const browser_useragent_map = {
  Edge: ["Edge"],
  "Opera Mini": ["Opera Mini"],
  "Opera Mobile": ["Opera Mobi"],
  Opera: ["Opera"],
  "Internet Explorer": ["Trident", "MSIE"],
  Chrome: ["Chrome"],
  Firefox: ["Firefox"],
  Safari: ["Safari"],
  Mozilla: ["Mozilla"],
};

export const browser_version_useragent_map = {
  Edge: /Edge\/([0-9]+(\.[0-9]+)?)/,
  "Opera Mini": /Opera Mini\/([0-9]+(\.[0-9]+)?)/,
  "Opera Mobile": /Version\/([0-9]+(\.[0-9]+)?)/,
  Opera: /Version\/([0-9]+(\.[0-9]+)?)/,
  "Internet Explorer": "rv:",
  Chrome: /Chrome\/([0-9]+(\.[0-9]+)?)/,
  Firefox: /rv:([0-9]+(\.[0-9]+)?)/,
  Safari: /Version\/([0-9]+(\.[0-9]+)?)/,
  Mozilla: /rv:([0-9]+(\.[0-9]+)?)/,
};

export const os_useragent_map = {
  "Chrome OS": "CrOS",
  "Mac OS": "Macintosh",
  Windows: "Windows",
  iOS: "like Mac",
  Android: "Android",
  Linux: "Linux",
};
