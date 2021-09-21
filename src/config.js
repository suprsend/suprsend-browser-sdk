const package_data = require("../package.json");

// suprsend sdk related config
const config = {
  api_url: "https://collector.suprsend.workers.dev",
  sdk_version: package_data.version,
  batch_size: 20,
  service_worker_file: "suprsend_service_worker.js",
  sw_delay: 5000, //in ms
};

export default config;
