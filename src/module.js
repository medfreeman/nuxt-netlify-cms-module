import { join, resolve, relative } from "path";

/* eslint-disable import/no-extraneous-dependencies */
/* covered by nuxt */
import _ from "lodash";
import { Utils } from "nuxt";
import chokidar from "chokidar";
import pify from "pify";
import webpack from "webpack";
import webpackDevMiddleware from "webpack-dev-middleware";
import serveStatic from "serve-static";
import Debug from "debug";

import pkg from "../package.json";

import { loadYAMLFile, toYAML } from "./utils/yaml.js";
import { setConfigPaths } from "./utils/netlify.config.js";
import webpackNetlifyConfig from "./webpack.config.js";

const debug = Debug("nuxt:netlify-cms");

const WEBPACK_CLIENT_COMPILER_NAME = "client";
const WEBPACK_NETLIFY_COMPILER_NAME = "netlify-cms";

// Defaults
const DEFAULTS = {
  adminPath: "admin",
  adminTitle: "Content Manager",
  cmsConfig: {
    media_folder: "static/uploads"
  }
};

export default function NetlifyCmsModule(moduleOptions) {
  const NETLIFY_CONFIG_FILE_NAME = join(
    this.options.rootDir,
    "netlify-cms.yml"
  );

  const getNetlifyCmsConfigFromFile = function() {
    return loadYAMLFile(NETLIFY_CONFIG_FILE_NAME) || {};
  };

  const transformNetlifyCmsConfigPaths = config => {
    return setConfigPaths(
      config,
      relative(this.options.rootDir, this.options.srcDir)
    );
  };

  const getWebpackNetlifyConfig = function(builder, adminPath, adminTitle) {
    return webpackNetlifyConfig.call(
      builder,
      WEBPACK_NETLIFY_COMPILER_NAME,
      adminPath,
      adminTitle
    );
  };

  const getDistDir = adminPath => {
    return resolve(this.options.buildDir, "dist", adminPath);
  };

  const getOptions = () => {
    const netlifyCmsConfig = getNetlifyCmsConfigFromFile();
    const options = {
      ...DEFAULTS,
      cmsConfig: {
        ...netlifyCmsConfig
      },
      ...this.options.netlifyCms,
      ...moduleOptions
    };
    options.cmsConfig = transformNetlifyCmsConfigPaths(options.cmsConfig);
    return options;
  };

  const options = getOptions();
  const ADMIN_PATH = options.adminPath.replace(/\/?$/, "/");
  const ADMIN_TITLE = options.adminTitle;
  const DIST_DIR = getDistDir(ADMIN_PATH);

  // This will be called once when builder started
  this.nuxt.plugin("build", async builder => {
    // This will be run just before webpack compiler starts
    builder.plugin("compile", ({ builder, compiler }) => {
      const webpackConfig = getWebpackNetlifyConfig(
        builder,
        ADMIN_PATH,
        ADMIN_TITLE
      );

      webpackConfig.plugins.push({
        apply(compiler) {
          compiler.plugin("emit", (compilation, cb) => {
            const netlifyConfigYAML = toYAML(getOptions().cmsConfig);
            compilation.assets["config.yml"] = {
              source: () => netlifyConfigYAML,
              size: () => netlifyConfigYAML.length
            };
            cb();
          });
        }
      });

      const netlifyCompiler = webpack(webpackConfig);

      // Only add the compiler in production,
      // in dev watch will be started by dev-middleware
      if (!this.options.dev) {
        compiler.compilers.push(netlifyCompiler);
        compiler[netlifyCompiler.name] = netlifyCompiler;
      }

      // Use shared filesystem and cache
      const clientCompiler = compiler[WEBPACK_CLIENT_COMPILER_NAME];
      netlifyCompiler.outputFileSystem = clientCompiler.outputFileSystem;
      netlifyCompiler.cache = clientCompiler.cache;

      // This will be run just after webpack compiler ends
      netlifyCompiler.plugin("done", async stats => {
        // Don't reload failed builds
        if (stats.hasErrors()) {
          return;
        }
      });

      // Create webpack dev middleware in development
      if (this.options.dev) {
        const netlifyWebpackDevMiddleware = pify(
          webpackDevMiddleware(netlifyCompiler, {
            publicPath: "/",
            stats: builder.webpackStats,
            noInfo: true,
            quiet: true,
            watchOptions: this.options.watchers.webpack
          })
        );

        // Inject to renderer instance
        if (builder.nuxt.renderer) {
          builder.nuxt.renderer.netlifyWebpackDevMiddleware = netlifyWebpackDevMiddleware;
        }
      }
    });

    // Show a message inside console when the build is ready
    builder.plugin("compiled", async () => {
      debug(`Serving on: ${ADMIN_PATH}`);
    });
  });

  // Serve netlify CMS
  if (this.options.dev) {
    // Insert webpackDevMiddleware to serve netlify CMS in development
    this.addServerMiddleware({
      path: ADMIN_PATH,
      handler: async (req, res) => {
        if (this.nuxt.renderer.netlifyWebpackDevMiddleware) {
          debug(`requesting url: ${Utils.urlJoin(ADMIN_PATH, req.url)}`);
          await this.nuxt.renderer.netlifyWebpackDevMiddleware(req, res);
        }
      }
    });

    // Stop webpack middleware on nuxt.close()
    this.nuxt.plugin("close", async () => {
      await this.nuxt.renderer.netlifyWebpackDevMiddleware.close();
    });

    // Start watching config file
    const patterns = [Utils.r(NETLIFY_CONFIG_FILE_NAME)];

    const options = {
      ...this.options.watchers.chokidar,
      ignoreInitial: true
    };

    const refreshFiles = _.debounce(
      () => this.nuxt.renderer.netlifyWebpackDevMiddleware.invalidate(),
      200
    );

    // Watch for src Files
    const fileWatcher = chokidar
      .watch(patterns, options)
      .on("add", refreshFiles)
      .on("change", refreshFiles)
      .on("unlink", refreshFiles);

    this.nuxt.renderer.netlifyFileWatcher = fileWatcher;

    // Stop watching on nuxt.close()
    this.nuxt.plugin("close", () => {
      this.nuxt.renderer.netlifyFileWatcher.close();
    });
  } else {
    // Statically serve netlify CMS (i.e. .nuxt/dist/admin/) files in production
    this.addServerMiddleware({
      path: ADMIN_PATH,
      handler: serveStatic(DIST_DIR, {
        maxAge: "1y" // 1 year in production
      })
    });
  }
}

// REQUIRED if publishing as an NPM package
export { pkg as meta };
