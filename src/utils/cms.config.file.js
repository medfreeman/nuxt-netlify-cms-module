import { singleton } from "needlepoint";

import { loadYAMLFile } from "./yaml";

@singleton
class CmsConfig {
  constructor(fileName) {
    this._fileName = fileName;
    this.readFile();
  }

  readFile() {
    this._config = loadYAMLFile(this._fileName) || {};
  }

  get config() {
    return this._config;
  }
}

export default CmsConfig;
