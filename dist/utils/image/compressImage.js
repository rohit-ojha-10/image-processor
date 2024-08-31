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
const axios_1 = __importDefault(require("axios"));
const sharp_1 = __importDefault(require("sharp"));
const cloudinary_1 = __importDefault(require("../../clients/cloudinary"));
// Function to compress the image and upload it to Cloudinary
const compressAndUploadImage = (imageUrl) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Download image
        const response = yield (0, axios_1.default)({ url: imageUrl, responseType: 'arraybuffer' });
        const imageBuffer = Buffer.from(response.data);
        // Compress image
        const compressedImageBuffer = yield (0, sharp_1.default)(imageBuffer)
            .resize({ width: 800 }) // Resize image
            .jpeg({ quality: 50 }) // Compress image
            .toBuffer();
        // Upload to Cloudinary
        const result = yield new Promise((resolve, reject) => {
            const stream = cloudinary_1.default.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(result);
                }
            });
            stream.end(compressedImageBuffer);
        });
        console.log(`Uploaded image to Cloudinary: ${result.secure_url}`);
        return result.secure_url;
    }
    catch (error) {
        console.error('Error processing image:', imageUrl, error);
        throw error;
    }
});
exports.default = compressAndUploadImage;
//# sourceMappingURL=compressImage.js.map