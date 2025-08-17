"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reactionSchema = exports.commentSchema = exports.updateAnnouncementSchema = exports.createAnnouncementSchema = void 0;
var zod_1 = require("zod");
exports.createAnnouncementSchema = zod_1.z.object({
    params: zod_1.z.object({ courseId: zod_1.z.string().transform(Number) }),
    body: zod_1.z.object({ title: zod_1.z.string().optional(), content: zod_1.z.string().min(1) })
});
exports.updateAnnouncementSchema = zod_1.z.object({
    params: zod_1.z.object({ id: zod_1.z.string().transform(Number) }),
    body: zod_1.z.object({ title: zod_1.z.string().optional(), content: zod_1.z.string().min(1).optional() })
});
exports.commentSchema = zod_1.z.object({
    params: zod_1.z.object({ id: zod_1.z.string().transform(Number) }),
    body: zod_1.z.object({ content: zod_1.z.string().min(1) })
});
exports.reactionSchema = zod_1.z.object({
    params: zod_1.z.object({ id: zod_1.z.string().transform(Number) }),
    body: zod_1.z.object({ value: zod_1.z.enum(["LIKE", "DISLIKE"]) })
});
