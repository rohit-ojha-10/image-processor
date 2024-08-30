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
exports.uploadFile = void 0;
const uuid_1 = require("uuid");
const validateCSV_1 = __importDefault(require("../utils/csv/validateCSV"));
const path_1 = __importDefault(require("path"));
const imageQueue_1 = __importDefault(require("../services/queue/imageQueue"));
const uploadFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file) {
        return res.status(400).send("No file uploaded.");
    }
    try {
        const filePath = path_1.default.join(__dirname, "../uploads", req.file.filename);
        // Validate the CSV file
        const errors = yield (0, validateCSV_1.default)(filePath);
        if ((errors === null || errors === void 0 ? void 0 : errors.length) > 0) {
            return res.status(400).json({ errors });
        }
        // Generate a unique request ID
        const requestId = (0, uuid_1.v4)();
        // Add the job to the queue
        yield imageQueue_1.default.add("processImages", {
            filePath,
            requestId,
        }, {
            jobId: requestId,
        });
        // returning the requestId immediately...
        res.json({ requestId });
    }
    catch (error) {
        console.error("Error processing the file:", error);
        res.status(500).send("Internal Server Error");
    }
});
exports.uploadFile = uploadFile;
//# sourceMappingURL=image.controller.js.map