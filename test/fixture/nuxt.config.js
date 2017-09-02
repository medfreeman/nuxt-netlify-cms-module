import module from "../../src/module";

export default {
  srcDir: __dirname,
  dev: false,
  render: {
    resourceHints: false
  },
  modules: [module]
};
