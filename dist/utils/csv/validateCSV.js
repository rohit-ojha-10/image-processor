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
const fs_1 = __importDefault(require("fs"));
const fast_csv_1 = require("fast-csv");
// Validate if image URLs are enclosed in quotes
const validateCSV = (filePath) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = [];
    try {
        const rows = yield new Promise((resolve, reject) => {
            const results = [];
            fs_1.default.createReadStream(filePath)
                .pipe((0, fast_csv_1.parse)({ headers: true }))
                .on('data', (row) => results.push(row))
                .on('end', () => resolve(results))
                .on('error', (error) => reject(error));
        });
        rows.forEach((row, index) => {
            // Check for required columns
            if (!row['Serial Number'] || !row['Product Name'] || !row['Input Image Urls']) {
                errors.push(`Row ${index + 1}: Missing required columns.`);
            }
            // Validate image URLs
            // const urlsString = row['Input Image Urls'];
            //     // Remove quotes and split URLs
            //     const urls = urlsString.split(',').map(url => url.trim());
            //     if (urls.some(url => !/^https?:\/\/.+\.(jpg|jpeg|png|gif)$/i.test(url))) {
            //         errors.push(`Row ${index + 1}: Some image URLs are not valid.`);
            //     }
        });
    }
    catch (error) {
        errors.push('Error reading or parsing the CSV file.');
    }
    return errors;
});
exports.default = validateCSV;
//# sourceMappingURL=validateCSV.js.map