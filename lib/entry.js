/* global REQUIRE_EXTENSIONS */
/* eslint-disable import/order */
function requireAll(r) {
  r.keys().forEach(r);
}

const CMS = require("netlify-cms");

if (REQUIRE_EXTENSIONS) {
  requireAll(require.context("extensions/", true, /\.js$/));
}
const CSS = require("netlify-cms/dist/cms.css");

module.exports = {
  CMS,
  CSS
};
