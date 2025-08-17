"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.registerSchema = void 0;
var zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email(),
        password: zod_1.z.string().min(6),
        name: zod_1.z.string().min(2),
        role: zod_1.z.enum(["STUDENT", "PROFESSOR"]),
        courseIds: zod_1.z.array(zod_1.z.number().int()).max(3)
    })
});
exports.loginSchema = zod_1.z.object({
    body: zod_1.z.object({ email: zod_1.z.string().email(), password: zod_1.z.string().min(6) })
});
