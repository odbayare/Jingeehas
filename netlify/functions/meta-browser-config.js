"use strict";

const { handler, response } = require("./_lib/http.js");
const { metaBrowserConfig } = require("./_lib/meta-capi.js");

exports.handler = handler("GET", async () => {
  const config = metaBrowserConfig();
  return response(200, config);
});
