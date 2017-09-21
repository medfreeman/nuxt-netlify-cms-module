import { existsSync } from "fs";
import { resolve } from "path";

import { Utils } from "nuxt";
/* eslint-disable import/no-extraneous-dependencies */
/* covered by nuxt */
import webpack from "webpack";
import HTMLPlugin from "html-webpack-plugin";
import ExtractTextPlugin from "extract-text-webpack-plugin";
import FriendlyErrorsWebpackPlugin from "friendly-errors-webpack-plugin";

export default function webpackNetlifyCmsConfig(
  name,
  nuxtOptions,
  moduleConfig
) {
  const ENTRY = resolve(__dirname, "../lib/entry");
  const BUILD_DIR = moduleConfig.buildDir;
  const CHUNK_FILENAME = nuxtOptions.build.filenames.chunk;
  const PUBLIC_PATH = Utils.urlJoin(
    nuxtOptions.router.base,
    moduleConfig.adminPath
  );
  const EXTENSIONS_DIR = moduleConfig.moduleConfigDir;
  const PAGE_TITLE = moduleConfig.adminTitle;
  const PAGE_TEMPLATE = resolve(__dirname, "../lib/template", "index.html");
  const REQUIRE_EXTENSIONS = existsSync(EXTENSIONS_DIR) ? true : false;
  const HMR_CLIENT = resolve(__dirname, "../lib/hmr.client");

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
      loaders: [
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
        REQUIRE_EXTENSIONS
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
      new ExtractTextPlugin({
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
