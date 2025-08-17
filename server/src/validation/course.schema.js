"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enrollSchema = void 0;
var zod_1 = require("zod");
exports.enrollSchema = zod_1.z.object({ body: zod_1.z.object({ courseIds: zod_1.z.array(zod_1.z.number().int()).min(1).max(3) }) });
