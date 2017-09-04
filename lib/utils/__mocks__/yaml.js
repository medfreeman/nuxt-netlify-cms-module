const module = require.requireActual("../yaml.js");

const toYAML = module.toYAML;

const loadYAMLFile = function() {
  const testConfigFile = "test/fixture/netlify-cms.yml.template";
  return module.loadYAMLFile(testConfigFile);
};

export { toYAML, loadYAMLFile };
