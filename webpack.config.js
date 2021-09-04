const path = require("path");

module.exports = (env) => {
  return {
    entry: path.resolve(__dirname, "src/index.js"),
    mode: "production",
    output: {
      filename: env.filename,
      path: path.resolve(__dirname, "dist"),
      library: { type: env.module_type, name: "suprsend" },
      environment: {
        arrowFunction: false,
      },
    },
    module: {
      rules: [
        {
          test: /\.(js)$/,
          exclude: /node_modules/,
          use: "babel-loader",
        },
      ],
    },
  };
};
