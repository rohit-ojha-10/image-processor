"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bull_1 = __importDefault(require("bull"));
const processImages_1 = __importDefault(require("./processImages"));
const imageQueue = new bull_1.default("imageQueue", {
    redis: {
        password: process.env.REDIS_PW,
        host: process.env.REDIS_HOST,
        port: 18362,
    },
});
imageQueue.process("processImages", processImages_1.default);
exports.default = imageQueue;
//# sourceMappingURL=imageQueue.js.map