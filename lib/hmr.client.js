(function() {
  "use strict";
  const webpackHotMiddlewareClient = require(`webpack-hot-middleware/client?name=client&reload=true&timeout=3000&dynamicPublicPath=true&path=__webpack_hmr`);

  webpackHotMiddlewareClient.subscribe(function(payload) {
    if (payload.action === "reload" || payload.reload === true) {
      window.location.reload();
    }
  });

  module.exports = webpackHotMiddlewareClient;
})();
