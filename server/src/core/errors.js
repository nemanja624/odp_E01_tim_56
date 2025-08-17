"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Unauthorized = exports.Forbidden = exports.BadRequest = exports.NotFound = exports.AppError = void 0;
var AppError = /** @class */ (function (_super) {
    __extends(AppError, _super);
    function AppError(status, message) {
        var _this = _super.call(this, message) || this;
        _this.status = status;
        return _this;
    }
    return AppError;
}(Error));
exports.AppError = AppError;
var NotFound = function (m) {
    if (m === void 0) { m = "Not found"; }
    return new AppError(404, m);
};
exports.NotFound = NotFound;
var BadRequest = function (m) {
    if (m === void 0) { m = "Bad request"; }
    return new AppError(400, m);
};
exports.BadRequest = BadRequest;
var Forbidden = function (m) {
    if (m === void 0) { m = "Forbidden"; }
    return new AppError(403, m);
};
exports.Forbidden = Forbidden;
var Unauthorized = function (m) {
    if (m === void 0) { m = "Unauthorized"; }
    return new AppError(401, m);
};
exports.Unauthorized = Unauthorized;
