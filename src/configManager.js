import { join, relative } from "path";

/* eslint-disable import/no-extraneous-dependencies */
/* covered by nuxt */
import _ from "lodash";

import CmsConfigFile from "./utils/cms.config.file";

const NUXT_CONFIG_KEY = "netlifyCms";
const NUXT_DIST_DIR = "dist";
const CMS_CONFIG_KEY = "cmsConfig";
const CMS_CONFIG_DIR = "netlify-cms";
const CMS_CONFIG_FILENAME = "config.yml";

// Defaults
const DEFAULTS = {
  adminPath: "admin",
  adminTitle: "Content Manager",
  cmsConfig: {
    media_folder: "static/uploads"
  }
};

class ConfigManager {
  constructor(nuxtOptions, moduleOptions) {
    this._relativeSrcDir = relative(nuxtOptions.rootDir, nuxtOptions.srcDir);

    this._userOptions = {
      ...nuxtOptions[NUXT_CONFIG_KEY],
      ...moduleOptions
    };

    const options = _.omit(
      {
        ...DEFAULTS,
        ...this._userOptions
      },
      CMS_CONFIG_KEY
    );
    options.adminPath = options.adminPath.replace(/\/?$/, "/");
    options.buildDir = join(
      nuxtOptions.buildDir,
      NUXT_DIST_DIR,
      options.adminPath
    );
    options.moduleConfigDir = join(nuxtOptions.srcDir, CMS_CONFIG_DIR);
    this._config = Object.freeze(options);

    this._cmsConfigFile = new CmsConfigFile(
      join(this._config.moduleConfigDir, CMS_CONFIG_FILENAME)
    );
  }

  get config() {
    return this._config;
  }

  get cmsConfig() {
    const config = this.constructor.setConfigPaths(
      {
        ...DEFAULTS[CMS_CONFIG_KEY],
        ...this._cmsConfigFile.config,
        ...this._userOptions[CMS_CONFIG_KEY]
      },
      this._relativeSrcDir
    );
    return config;
  }

  get cmsConfigFileName() {
    return this._cmsConfigFile.fileName;
  }

  readCmsConfigFile() {
    return this._cmsConfigFile.readFile();
  }

  static setConfigPaths(configObject, enforcedPath) {
    const newConfig = {
      collections: []
    };

    newConfig.media_folder = join(enforcedPath, configObject.media_folder);

    if (configObject.collections) {
      configObject.collections.forEach(function(collection) {
        if (collection.folder) {
          newConfig.collections.push({
            ...collection,
            folder: join(enforcedPath, collection.folder)
          });
        } else if (collection.files) {
          const collectionFiles = [];
          collection.files.forEach(function(fileEntry) {
            fileEntry.file &&
              collectionFiles.push({
                ...fileEntry,
                file: join(enforcedPath, fileEntry.file)
              });
          });
          newConfig.collections.push({
            ...collection,
            files: collectionFiles
          });
        }
      });
    }

    return {
      ...configObject,
      ...newConfig
    };
  }
}

export default ConfigManager;
