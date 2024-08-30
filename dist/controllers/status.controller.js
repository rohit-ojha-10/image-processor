"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const imageQueue_1 = __importDefault(require("../services/queue/imageQueue"));
const redisClient_1 = require("../clients/redisClient");
const constants_1 = require("../utils/constants");
const getStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { requestId } = req.params;
    try {
        const job = yield imageQueue_1.default.getJob(requestId);
        if (job) {
            const state = yield job.getState();
            const progress = job.progress(); // Get the progress percentage
            // Fetch the uploaded URLs from Redis
            try {
                const data = yield redisClient_1.redisClient.hGetAll(`job:${requestId}`);
                const uploadedUrls = data
                    ? Object.keys(data).reduce((acc, key) => {
                        acc[key] = JSON.parse(data[key]);
                        return acc;
                    }, {})
                    : {};
                res.json({
                    requestId,
                    status: constants_1.status[state],
                    progress,
                    uploadedUrls,
                });
            }
            catch (err) {
                console.error("Error fetching data from Redis:", err);
                res.status(500).send("Internal Server Error");
            }
        }
        else {
            res.status(404).send("Job not found");
        }
    }
    catch (error) {
        console.error("Error fetching job status:", error);
        res.status(500).send("Internal Server Error");
    }
});
exports.default = getStatus;
//# sourceMappingURL=status.controller.js.map