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
const bull_1 = __importDefault(require("bull"));
const validateCSV_1 = __importDefault(require("../../utils/csv/validateCSV"));
const parseCSV_1 = __importDefault(require("../../utils/csv/parseCSV"));
const cloudinary_1 = __importDefault(require("../../clients/cloudinary"));
const compressImage_1 = __importDefault(require("../../utils/image/compressImage"));
const redisClient_1 = require("../../clients/redisClient");
const imageQueue = new bull_1.default('imageQueue', {
    redis: {
        password: process.env.REDIS_PW,
        host: process.env.REDIS_HOST,
        port: 18362,
    },
});
imageQueue.process('processImages', (job) => __awaiter(void 0, void 0, void 0, function* () {
    const { filePath, requestId } = job.data;
    console.log(`Job ${requestId} started processing file: ${filePath}`);
    // Validate the CSV file
    const errors = yield (0, validateCSV_1.default)(filePath);
    if (errors.length > 0) {
        throw new Error(`Validation errors: ${errors.join(', ')}`);
    }
    //stagger
    yield new Promise((res) => setTimeout(() => res(true), 10000));
    // Parse the CSV file
    const csvData = yield (0, parseCSV_1.default)(filePath);
    // Process each image URL
    const totalImages = csvData.reduce((count, row) => count + row['Input Image Urls'].split(',').length, 0);
    let processedImages = 0;
    const uploadedUrls = {};
    for (const row of csvData) {
        const imageUrls = row['Input Image Urls'].split(',').map(url => url.trim().replace(/"/g, ''));
        const outputUrls = [];
        for (const imageUrl of imageUrls) {
            // Compress the image  and upload it to Cloudinary
            const { inputPath, outputPath: compressedImagePath } = yield (0, compressImage_1.default)(imageUrl);
            const result = yield cloudinary_1.default.uploader.upload(compressedImagePath);
            // console.log(`Uploaded image: ${result.secure_url}`);
            outputUrls.push(result.secure_url);
            yield redisClient_1.redisClient.hSet(`job:${requestId}`, row['Product Name'], JSON.stringify(outputUrls));
            // Update progress
            processedImages += 1;
            const progressPercentage = Math.round((processedImages / totalImages) * 100);
            job.progress(progressPercentage);
        }
        uploadedUrls[row['Product Name']] = outputUrls;
    }
    console.log(`Job ${requestId} processed successfully.`);
    return uploadedUrls;
}));
exports.default = imageQueue;
//# sourceMappingURL=imageQueue.js.map