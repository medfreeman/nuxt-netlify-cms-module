import module from "../../src/module";

export default {
  srcDir: __dirname,
  buildDir: ".nuxt",
  generate: {
    dir: ".dist"
  },
  dev: false,
  render: {
    resourceHints: false
  },
  modules: [module]
};
