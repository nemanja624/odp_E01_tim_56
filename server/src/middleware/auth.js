"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
var jsonwebtoken_1 = require("jsonwebtoken");
var env_1 = require("../config/env");
function requireAuth(req, res, next) {
    var _a;
    var token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a[env_1.env.COOKIE_NAME];
    if (!token)
        return res.status(401).json({ message: "Unauthorized" });
    try {
        var payload = jsonwebtoken_1.default.verify(token, env_1.env.JWT_SECRET);
        req.user = payload;
        next();
    }
    catch (_b) {
        return res.status(401).json({ message: "Invalid token" });
    }
}
