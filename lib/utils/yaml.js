import { readFileSync, existsSync } from "fs";

import { safeLoad, safeDump } from "js-yaml";
import Debug from "debug";

const debug = Debug("nuxt:netlify-cms");

const toYAML = function(object) {
  try {
    const yaml = safeDump(object);
    return yaml;
  } catch (e) {
    debug(e.message, e.name);
    return false;
  }
};

const loadYAMLFile = function(configFile) {
  if (existsSync(configFile)) {
    try {
      const config = readFileSync(configFile, "utf8");
      const contents = safeLoad(config, {
        filename: configFile,
        onWarning: debug
      });
      return contents;
    } catch (e) {
      debug(e.message, e.name);
      return false;
    }
  }
  return false;
};

export { toYAML, loadYAMLFile };
