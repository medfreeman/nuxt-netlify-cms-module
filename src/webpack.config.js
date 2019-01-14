import { existsSync } from "fs";
import { resolve } from "path";

import { urlJoin } from "@nuxt/common";
/* eslint-disable import/no-extraneous-dependencies */
/* covered by nuxt */
import webpack from "webpack";
import HTMLPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import FriendlyErrorsWebpackPlugin from "friendly-errors-webpack-plugin";

export default function webpackNetlifyCmsConfig(
  name,
  nuxtOptions,
  moduleConfig
) {
  const ENTRY = resolve(__dirname, "../lib/entry");
  const BUILD_DIR = moduleConfig.buildDir;
  const CHUNK_FILENAME = nuxtOptions.build.filenames.chunk({
    isDev: nuxtOptions.dev,
    isModern: nuxtOptions.modern
  });
  const PUBLIC_PATH = urlJoin(nuxtOptions.router.base, moduleConfig.adminPath);
  const EXTENSIONS_DIR = moduleConfig.moduleConfigDir;
  const PAGE_TITLE = moduleConfig.adminTitle;
  const PAGE_TEMPLATE = resolve(__dirname, "../lib/template", "index.html");
  const REQUIRE_EXTENSIONS = existsSync(EXTENSIONS_DIR) ? true : false;
  const HMR_CLIENT = resolve(__dirname, "../lib/hmr.client");
  const CSS_FILE = "netlify-cms/dist/cms.css";
  const REQUIRE_CSS = existsSync(resolve(__dirname, "node_modules", CSS_FILE))
    ? true
    : false;

  const config = {
    name,
    entry: {
      app: ENTRY
    },
    output: {
      path: BUILD_DIR,
      filename: "bundle.[hash].js",
      chunkFilename: CHUNK_FILENAME,
      publicPath: PUBLIC_PATH
    },
    module: {
      rules: [
        { test: /\.css$/, loader: "style-loader!css-loader" },
        {
          test: /\.(eot|svg|ttf|woff|woff2)$/,
          loader: "url-loader",
          options: {
            limit: 1000, // 1 KO
            name: "public/fonts/[name].[hash:7].[ext]"
          }
        }
      ]
    },
    resolve: {
      alias: {
        extensions: EXTENSIONS_DIR
      }
    },
    plugins: [
      new HTMLPlugin({
        title: PAGE_TITLE,
        filename: "index.html",
        template: PAGE_TEMPLATE,
        inject: true,
        chunksSortMode: "dependency"
      }),
      new webpack.DefinePlugin({
        REQUIRE_EXTENSIONS,
        REQUIRE_CSS,
        CSS_FILE
      })
    ]
  };

  // --------------------------------------
  // Development specific config
  // --------------------------------------
  if (nuxtOptions.dev) {
    // Add HMR support
    config.entry.app = [HMR_CLIENT, config.entry.app];

    config.plugins.push(
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin(),
      // Add friendly error plugin
      new FriendlyErrorsWebpackPlugin(),
      // https://webpack.js.org/plugins/named-modules-plugin
      new webpack.NamedModulesPlugin()
    );
  } else {
    // --------------------------------------
    // Production specific config
    // --------------------------------------
    // Minify and optimize the JavaScript
    config.plugins.push(
      // CSS extraction
      new MiniCssExtractPlugin({
        filename: "style.[contenthash].css"
      }),
      // This is needed in webpack 2 for minify CSS
      new webpack.LoaderOptionsPlugin({
        minimize: true
      })
    );
  }

  return config;
}
