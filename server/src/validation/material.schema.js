"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMaterialSchema = void 0;
var zod_1 = require("zod");
exports.createMaterialSchema = zod_1.z.object({
    params: zod_1.z.object({ courseId: zod_1.z.string().transform(Number) }),
    body: zod_1.z.object({ title: zod_1.z.string().min(1), description: zod_1.z.string().optional() })
});
