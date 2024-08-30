"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const status_controller_1 = __importDefault(require("../controllers/status.controller"));
const statusRouter = (0, express_1.Router)();
statusRouter.get('/:requestId', status_controller_1.default);
exports.default = statusRouter;
//# sourceMappingURL=status.routes.js.map