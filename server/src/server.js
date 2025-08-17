"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// server/src/server.ts
var app_js_1 = require("./app.js");
var env_js_1 = require("./config/env.js");
var PORT = env_js_1.env.PORT || 3000;
app_js_1.default.listen(PORT, function () {
    console.log("\u2705 Server radi na http://localhost:".concat(PORT));
});
