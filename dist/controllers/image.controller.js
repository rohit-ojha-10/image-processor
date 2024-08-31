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
const cloudinary_1 = __importDefault(require("../clients/cloudinary")); // Adjust the import as needed
const stream_1 = require("stream");
const imageQueue_1 = __importDefault(require("../services/queue/imageQueue"));
const uploadFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file) {
        return res.status(400).send("No file uploaded.");
    }
    try {
        // Upload the file to Cloudinary
        const uploadResult = yield new Promise((resolve, reject) => {
            const uploadStream = cloudinary_1.default.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
                if (error) {
                    return reject(error);
                }
                resolve(result);
            });
            // Pipe the file buffer directly to Cloudinary
            stream_1.Readable.from(req.file.buffer).pipe(uploadStream);
        });
        // The URL of the uploaded file on Cloudinary
        const fileUrl = uploadResult.secure_url;
        // Validate the CSV file if needed
        // Since we are uploading directly to Cloudinary, this step is for processing the uploaded file.
        yield (0, validateCSV_1.default)(fileUrl);
        // Generate a unique request ID
        const requestId = (0, uuid_1.v4)();
        // Add the job to the queue with the Cloudinary URL
        yield imageQueue_1.default.add("processImages", {
            fileUrl,
            requestId,
        }, {
            jobId: requestId,
        });
        // Return the request ID immediately
        res.json({ requestId });
    }
    catch (error) {
        console.error("Error processing the file:", error);
        res.status(500).send("Internal Server Error");
    }
});
exports.uploadFile = uploadFile;
//# sourceMappingURL=image.controller.js.map