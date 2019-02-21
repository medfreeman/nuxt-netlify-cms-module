/* eslint-disable import/no-extraneous-dependencies */
import { resolve, join } from "path";

/* covered by nuxt */
import { copy } from "fs-extra";
import _ from "lodash";
import { r, urlJoin } from "@nuxt/common";
import consola from "consola";
import chokidar from "chokidar";
import env from "std-env";
import pify from "pify";
import webpack from "webpack";
import webpackDevMiddleware from "webpack-dev-middleware";
import webpackHotMiddleware from "webpack-hot-middleware";
import WebpackBar from "webpackbar";
import serveStatic from "serve-static";

import pkg from "../package.json";

import ConfigManager from "./configManager";
import getWebpackNetlifyConfig from "./webpack.config";
import { toYAML } from "./utils/yaml";

const logger = consola.withScope("nuxt:netlify-cms");

const WEBPACK_CLIENT_COMPILER_NAME = "client";
const WEBPACK_NETLIFY_COMPILER_NAME = "netlify-cms";
const NETLIFY_CONFIG_FILE_NAME = "config.yml";

export default function NetlifyCmsModule(moduleOptions) {
  const configManager = new ConfigManager(this.options, moduleOptions);
  const config = configManager.config;

  const emitNetlifyConfig = compilation => {
    const netlifyConfigYAML = toYAML(configManager.cmsConfig);
    compilation.assets[NETLIFY_CONFIG_FILE_NAME] = {
      source: () => netlifyConfigYAML,
      size: () => netlifyConfigYAML.length
    };
  };

  // This will be called once when builder started
  this.nuxt.hook("build:before", builder => {
    const bundleBuilder = builder.bundleBuilder;

    const webpackConfig = getWebpackNetlifyConfig(
      WEBPACK_NETLIFY_COMPILER_NAME,
      this.options,
      config
    );

    webpackConfig.plugins.push({
      apply(compiler) {
        compiler.hooks.emit.tapAsync("NetlifyCMSPlugin", (compilation, cb) => {
          compilation.hooks.additionalAssets.tapAsync(
            "NetlifyCMSPlugin",
            callback => {
              emitNetlifyConfig(compilation);
              callback();
            }
          );

          emitNetlifyConfig(compilation);
          cb();
        });
      }
    });

    !this.options.dev &&
      webpackConfig.plugins.push(
        new WebpackBar({
          name: WEBPACK_NETLIFY_COMPILER_NAME,
          color: "red",
          reporters: ["basic", "fancy", "profile", "stats"],
          basic: !this.options.build.quiet && env.minimalCLI,
          fancy: !this.options.build.quiet && !env.minimalCLI,
          profile: !this.options.build.quiet && this.options.build.profile,
          stats:
            !this.options.build.quiet &&
            !this.options.dev &&
            this.options.build.stats,
          reporter: {
            change: (_, { shortPath }) => {
              this.nuxt.callHook("bundler:change", shortPath);
            },
            done: context => {
              if (context.hasErrors) {
                this.nuxt.callHook("bundler:error");
              }
            },
            allDone: () => {
              this.nuxt.callHook("bundler:done");
            }
          }
        })
      )

    const netlifyCompiler = webpack(webpackConfig);

    // This will be run just before webpack compiler starts
    this.nuxt.hook("build:compile", ({ name }) => {
      if (name !== WEBPACK_CLIENT_COMPILER_NAME) {
        return;
      }

      logger.success("Netlify-cms builder initialized");

      // This will be run just after webpack compiler ends
      netlifyCompiler.hooks.done.tapAsync(
        "NetlifyCMSPlugin",
        async (stats, cb) => {
          // Don't reload failed builds
          if (stats.hasErrors()) {
            /* istanbul ignore next */
            return;
          }

          // Show a message inside console when the build is ready
          this.options.dev &&
            logger.info(`Netlify-cms served on: ${config.adminPath}`);

          cb();
        }
      );

      // in development
      if (this.options.dev) {
        // Use shared filesystem and cache
        netlifyCompiler.outputFileSystem = bundleBuilder.mfs;

        // Create webpack dev middleware
        const netlifyWebpackDevMiddleware = pify(
          webpackDevMiddleware(netlifyCompiler, {
            publicPath: "/",
            stats: false,
            logLevel: "silent",
            watchOptions: this.options.watchers.webpack
          })
        );
        netlifyWebpackDevMiddleware.close = pify(
          netlifyWebpackDevMiddleware.close
        );

        // Create webpack hot middleware
        const netlifyWebpackHotMiddleware = pify(
          webpackHotMiddleware(netlifyCompiler, {
            log: false,
            heartbeat: 1000
          })
        );

        // Inject to renderer instance
        if (builder.nuxt.renderer) {
          builder.nuxt.renderer.netlifyWebpackDevMiddleware = netlifyWebpackDevMiddleware;
          builder.nuxt.renderer.netlifyWebpackHotMiddleware = netlifyWebpackHotMiddleware;
        }

        // Stop webpack middleware on nuxt.close()
        this.nuxt.hook("close", async () => {
          await this.nuxt.renderer.netlifyWebpackDevMiddleware.close();
        });
      } else {
        // Only run the compiler in production,
        // in dev build is started by dev-middleware hooked to client webpack compiler
        this.nuxt.hook("build:done", async () => {
          await new Promise((resolve, reject) => {
            netlifyCompiler.run((err, stats) => {
              /* istanbul ignore next */
              if (err) {
                return reject(err);
              } else if (stats.hasErrors()) {
                if (this.options.test) {
                  err = stats.toString(this.options.build.stats);
                }

                return reject(err);
              }

              resolve();
            });
          });
        });
      }
    });
  });

  // Serve netlify CMS
  if (this.options.dev) {
    // Insert webpackDevMiddleware to serve netlify CMS in development
    this.addServerMiddleware({
      path: config.adminPath,
      handler: async (req, res) => {
        if (this.nuxt.renderer.netlifyWebpackDevMiddleware) {
          logger.info(
            `Netlify-cms requested url: ${urlJoin(config.adminPath, req.url)}`
          );

          await this.nuxt.renderer.netlifyWebpackDevMiddleware(req, res);
        }
        if (this.nuxt.renderer.netlifyWebpackHotMiddleware) {
          await this.nuxt.renderer.netlifyWebpackHotMiddleware(req, res);
        }
      }
    });

    // Start watching config file
    const patterns = [r(configManager.cmsConfigFileName)];

    const options = {
      ...this.options.watchers.chokidar,
      ignoreInitial: true
    };

    const refreshFiles = _.debounce(() => {
      configManager.readCmsConfigFile();
      this.nuxt.renderer.netlifyWebpackDevMiddleware.invalidate();
      this.nuxt.renderer.netlifyWebpackHotMiddleware.publish({
        action: "reload"
      });

      logger.info("Netlify-cms files refreshed");
    }, 200);

    // Watch for src Files
    const fileWatcher = chokidar
      .watch(patterns, options)
      .on("add", refreshFiles)
      .on("change", refreshFiles)
      .on("unlink", refreshFiles);

    this.nuxt.renderer.netlifyFileWatcher = fileWatcher;

    // Stop watching on nuxt.close()
    this.nuxt.hook("close", () => {
      this.nuxt.renderer.netlifyFileWatcher.close();
    });
  } else {
    // Statically serve netlify CMS (i.e. .nuxt/dist/admin/) files in production
    this.addServerMiddleware({
      path: config.adminPath,
      handler: serveStatic(config.buildDir, {
        maxAge: "1y" // 1 year in production
      })
    });
  }

  // Move cms folder from `.nuxt/dist/admin` folder to `dist/` after nuxt generate
  this.nuxt.hook("generate:distCopied", async nuxt => {
    await copy(
      resolve(nuxt.options.buildDir, "dist", config.adminPath).replace(
        /\/$/,
        ""
      ),
      join(nuxt.distPath, config.adminPath).replace(/\/$/, "")
    );

    logger.success("Netlify-cms files copied");
  });
}

// REQUIRED if publishing as an NPM package
export { pkg as meta };
