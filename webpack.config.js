const path = require("path")

module.exports = {
  entry: {
    server: path.resolve("./src/server.js"),
  },
  output: {
    path: path.resolve("./src"),
    filename: "server.bundle.js",
  },
  mode: "production",
  devtool: false,

  module: {
    rules: [
      // JavaScript
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
    ],
  },
  target: "node",
}
