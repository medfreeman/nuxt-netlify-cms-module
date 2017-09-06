import { existsSync } from "fs";
import { join, resolve } from "path";

import { Utils } from "nuxt";
/* eslint-disable import/no-extraneous-dependencies */
/* covered by nuxt */
import webpack from "webpack";
import HTMLPlugin from "html-webpack-plugin";
import ExtractTextPlugin from "extract-text-webpack-plugin";

export default function webpackNetlifyCmsConfig(
  name,
  urlPath,
  pageTitle,
  extensionsDir
) {
  const EXTENSIONS_DIR = join(this.options.srcDir, extensionsDir);
  const config = {
    name,
    entry: resolve(__dirname, "../lib/entry.js"),
    output: {
      path: resolve(this.options.buildDir, "dist", urlPath),
      filename: "bundle.[chunkhash].js",
      chunkFilename: this.options.build.filenames.chunk,
      publicPath: Utils.urlJoin(this.options.router.base, urlPath)
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
        title: pageTitle,
        filename: "index.html",
        template: resolve(__dirname, "../lib/template", "index.html"),
        inject: true,
        chunksSortMode: "dependency"
      }),
      new webpack.DefinePlugin({
        REQUIRE_EXTENSIONS: existsSync(EXTENSIONS_DIR) ? true : false
      })
    ]
  };

  // --------------------------------------
  // Production specific config
  // --------------------------------------
  if (!this.options.dev) {
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
