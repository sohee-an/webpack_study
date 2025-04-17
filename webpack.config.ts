import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import { Configuration as WebpackDevServerConfiguration } from "webpack-dev-server";
import webpack, { Configuration as WebpackConfiguration } from "webpack";

const isDevelopment = process.env.NODE_ENV !== "production";

interface Configuration extends WebpackConfiguration {
  devServer?: WebpackDevServerConfiguration;
}

const config: Configuration = {
  name: "webpack-study",
  mode: isDevelopment ? "development" : "production",
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
    alias: {
      "@hooks": path.resolve(__dirname, "hooks"),
      "@components": path.resolve(__dirname, "components"),
      "@layouts": path.resolve(__dirname, "layouts"),
      "@pages": path.resolve(__dirname, "pages"),
      "@utils": path.resolve(__dirname, "utils"),
      "@typings": path.resolve(__dirname, "typings"),
    },
  },
  entry: "./src/index.tsx",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  devServer: {
    static: "./public",
    port: 3000,
    hot: true,
    open: true, // 브라우저 자동 열기
    historyApiFallback: true,
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        exclude: /node_modules/,
        options: {
          transpileOnly: true, // ⚠️ react-refresh 호환 위해 추천
        },
      },
    ],
  },
  plugins: [],
};

if (isDevelopment && config.plugins) {
  config.plugins.push(new ReactRefreshWebpackPlugin());
  config.plugins.push(
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      filename: "index.html",
    })
  );
}
