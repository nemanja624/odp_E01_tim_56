"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
var validate = function (schema) { return function (req, res, next) {
    try {
        schema.parse({ body: req.body, params: req.params, query: req.query });
        next();
    }
    catch (e) {
        return res.status(400).json({ message: "Validation error", issues: e.issues });
    }
}; };
exports.validate = validate;
