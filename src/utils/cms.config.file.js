import { loadYAMLFile } from "./yaml";

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

  get fileName() {
    return this._fileName;
  }
}

export default CmsConfig;
