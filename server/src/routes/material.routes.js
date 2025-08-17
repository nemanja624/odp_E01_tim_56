"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var multer_1 = require("multer");
var path_1 = require("path");
var http_1 = require("../core/http");
var auth_1 = require("../middleware/auth");
var rbac_1 = require("../middleware/rbac");
var validate_1 = require("../middleware/validate");
var material_schema_1 = require("../validation/material.schema");
var ctrl = require("../controllers/material.controller");
var r = (0, express_1.Router)();
var storage = multer_1.default.diskStorage({
    destination: function (_req, _file, cb) { return cb(null, path_1.default.join(process.cwd(), "src", "uploads", "materials")); },
    filename: function (_req, file, cb) { return cb(null, Date.now() + "-" + file.originalname); }
});
var upload = (0, multer_1.default)({ storage: storage, fileFilter: function (_req, file, cb) {
        var ok = ["application/pdf", "text/plain"].includes(file.mimetype);
        cb(ok ? null : new Error("Only PDF/TXT"), ok);
    } });
r.get("/course/:courseId", auth_1.requireAuth, (0, http_1.asyncHandler)(ctrl.listByCourse));
r.post("/course/:courseId", auth_1.requireAuth, (0, rbac_1.requireRole)("PROFESSOR"), upload.single("file"), (0, validate_1.validate)(material_schema_1.createMaterialSchema), (0, http_1.asyncHandler)(function (req, res) { req.fileUrl = "/static/materials/".concat(req.file.filename); req.mimeType = req.file.mimetype; return ctrl.create(req, res); }));
r.delete("/:id", auth_1.requireAuth, (0, rbac_1.requireRole)("PROFESSOR"), (0, http_1.asyncHandler)(ctrl.remove));
exports.default = r;
