/* global REQUIRE_EXTENSIONS, REQUIRE_CSS, CSS_FILE */
/* eslint-disable import/order */

function requireAll(r) {
  r.keys().forEach(r);
}

const CMS = require("netlify-cms");

if (REQUIRE_EXTENSIONS) {
  requireAll(require.context("extensions/", true, /\.js$/));
}

if (REQUIRE_CSS) {
  require(CSS_FILE);
}

module.exports = {
  CMS
};
