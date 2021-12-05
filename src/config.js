const package_data = require("../package.json");

const config = {
  api_url: "https://hub.suprsend.com",
  sdk_version: package_data.version,
  batch_size: 20,
  service_worker_file: "suprsend_service_worker.js",
  sw_delay: 5000, //in ms,
};

export default config;
