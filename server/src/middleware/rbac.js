"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = requireRole;
function requireRole(role) {
    return function (req, res, next) {
        var user = req.user;
        if (!user)
            return res.status(401).json({ message: "Unauthorized" });
        if (user.role !== role)
            return res.status(403).json({ message: "Forbidden" });
        next();
    };
}
