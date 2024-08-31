"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const image_controller_1 = require("../controllers/image.controller");
// Memory storage for Multer
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
const imageRouter = (0, express_1.Router)();
imageRouter.post('/upload', upload.single('file'), image_controller_1.uploadFile);
exports.default = imageRouter;
//# sourceMappingURL=image.route.js.map