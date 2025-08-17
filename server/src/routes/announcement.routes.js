"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var multer_1 = require("multer");
var path_1 = require("path");
var http_1 = require("../core/http");
var auth_1 = require("../middleware/auth");
var rbac_1 = require("../middleware/rbac");
var validate_1 = require("../middleware/validate");
var announcement_schema_1 = require("../validation/announcement.schema");
var ctrl = require("../controllers/announcement.controller");
var r = (0, express_1.Router)();
var storage = multer_1.default.diskStorage({
    destination: function (_req, _file, cb) { return cb(null, path_1.default.join(process.cwd(), "src", "uploads", "images")); },
    filename: function (_req, file, cb) { return cb(null, Date.now() + "-" + file.originalname); }
});
var upload = (0, multer_1.default)({ storage: storage, fileFilter: function (_req, file, cb) {
        var ok = ["image/png", "image/jpeg", "image/jpg"].includes(file.mimetype);
        cb(ok ? null : new Error("Only PNG/JPEG"), ok);
    } });
r.get("/course/:courseId", auth_1.requireAuth, (0, http_1.asyncHandler)(ctrl.listByCourse));
r.post("/course/:courseId", auth_1.requireAuth, (0, rbac_1.requireRole)("PROFESSOR"), upload.single("image"), (0, validate_1.validate)(announcement_schema_1.createAnnouncementSchema), (0, http_1.asyncHandler)(function (req, res) { req.fileUrl = req.file ? "/static/images/".concat(req.file.filename) : undefined; return ctrl.create(req, res); }));
r.put("/:id", auth_1.requireAuth, (0, rbac_1.requireRole)("PROFESSOR"), (0, validate_1.validate)(announcement_schema_1.updateAnnouncementSchema), (0, http_1.asyncHandler)(ctrl.update));
r.get("/:id/comments", auth_1.requireAuth, (0, http_1.asyncHandler)(ctrl.comments));
r.post("/:id/comments", auth_1.requireAuth, (0, validate_1.validate)(announcement_schema_1.commentSchema), (0, http_1.asyncHandler)(ctrl.addComment));
r.put("/:id/comments/:commentId", auth_1.requireAuth, (0, http_1.asyncHandler)(ctrl.updateComment));
r.delete("/:id/comments/:commentId", auth_1.requireAuth, (0, http_1.asyncHandler)(ctrl.deleteComment));
r.get("/:id/reactions", auth_1.requireAuth, (0, http_1.asyncHandler)(ctrl.reactionCounts));
r.post("/:id/reactions", auth_1.requireAuth, (0, validate_1.validate)(announcement_schema_1.reactionSchema), (0, http_1.asyncHandler)(ctrl.react));
r.delete("/:id/reactions", auth_1.requireAuth, (0, http_1.asyncHandler)(ctrl.unreact));
exports.default = r;
