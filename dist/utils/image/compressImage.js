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
const fs_extra_1 = __importDefault(require("fs-extra"));
const sharp_1 = __importDefault(require("sharp"));
const path_1 = __importDefault(require("path"));
const TEMP_DIR = path_1.default.join(__dirname, '../tmp');
// Ensure tmp directory exists
fs_extra_1.default.ensureDirSync(TEMP_DIR);
const compressImage = (imageUrl) => __awaiter(void 0, void 0, void 0, function* () {
    const uniqueId = Date.now().toString(); // Unique identifier for each file
    const inputPath = path_1.default.join(TEMP_DIR, `input-${uniqueId}.jpg`);
    const outputPath = path_1.default.join(TEMP_DIR, `output-${uniqueId}.jpg`);
    try {
        // Download image
        const response = yield (0, axios_1.default)({ url: imageUrl, responseType: 'arraybuffer' });
        fs_extra_1.default.writeFileSync(inputPath, response.data);
        // Compress image
        yield (0, sharp_1.default)(inputPath)
            .resize({ width: 800 }) // Resize image
            .jpeg({ quality: 50 }) // Compress image
            .toFile(outputPath);
        return { inputPath, outputPath };
    }
    catch (error) {
        console.error('Error processing image:', imageUrl, error);
        throw error;
    }
});
exports.default = compressImage;
//# sourceMappingURL=compressImage.js.map