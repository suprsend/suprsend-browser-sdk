const package_data = require("../package.json");

// suprsend sdk related config
const config = {
  api_url: "https://collector.suprsend.workers.dev",
  sdk_version: package_data.version,
  batch_size: 20,
};

export default config;
