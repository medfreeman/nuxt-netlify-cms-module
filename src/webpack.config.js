import { existsSync } from "fs";
import { resolve } from "path";

import { Utils } from "nuxt";
/* eslint-disable import/no-extraneous-dependencies */
/* covered by nuxt */
import webpack from "webpack";
import HTMLPlugin from "html-webpack-plugin";
import ExtractTextPlugin from "extract-text-webpack-plugin";

export default function webpackNetlifyCmsConfig(
  name,
  nuxtOptions,
  moduleConfig
) {
  const ENTRY = resolve(__dirname, "../lib/entry.js");
  const BUILD_DIR = moduleConfig.buildDir;
  const CHUNK_FILENAME = nuxtOptions.build.filenames.chunk;
  const PUBLIC_PATH = Utils.urlJoin(
    nuxtOptions.router.base,
    moduleConfig.adminPath
  );
  const EXTENSIONS_DIR = moduleConfig.extensionsDir;
  const PAGE_TITLE = moduleConfig.adminTitle;
  const PAGE_TEMPLATE = resolve(__dirname, "../lib/template", "index.html");
  const REQUIRE_EXTENSIONS = existsSync(EXTENSIONS_DIR) ? true : false;

  const config = {
    name,
    entry: ENTRY,
    output: {
      path: BUILD_DIR,
      filename: "bundle.[chunkhash].js",
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
  // Production specific config
  // --------------------------------------
  if (!nuxtOptions.dev) {
    // CSS extraction
    config.plugins.push(
      new ExtractTextPlugin({
        filename: "style.[contenthash].css"
      })
    );
    // This is needed in webpack 2 for minify CSS
    config.plugins.push(
      new webpack.LoaderOptionsPlugin({
        minimize: true
      })
    );
  }

  return config;
}
