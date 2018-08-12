import { readFileSync } from "fs";

import { safeLoad, safeDump } from "js-yaml";
/* eslint-disable import/no-extraneous-dependencies */
/* covered by nuxt */
import Debug from "debug";

const debug = Debug("nuxt:netlify-cms");

const toYAML = function(object) {
  try {
    const yaml = safeDump(object);
    return yaml;
  } catch (e) {
    /* istanbul ignore next */
    debug(e.message, e.name);
    return false;
  }
};

const loadYAMLFile = function(configFile) {
  try {
    const config = readFileSync(configFile, "utf8");
    const contents = safeLoad(config, {
      filename: configFile,
      onWarning: debug
    });
    return contents;
  } catch (e) {
    /* istanbul ignore next */
    if (e.code !== "ENOENT") {
      debug(e.message, e.name);
    }
    return false;
  }
};

export { toYAML, loadYAMLFile };
