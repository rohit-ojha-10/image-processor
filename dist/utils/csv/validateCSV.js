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
const fast_csv_1 = require("fast-csv");
const validateCSV = (fileUrl) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = [];
    try {
        // Fetch the CSV file from Cloudinary
        const response = yield axios_1.default.get(fileUrl, { responseType: 'stream' });
        const rows = [];
        const stream = response.data;
        yield new Promise((resolve, reject) => {
            stream
                .pipe((0, fast_csv_1.parse)({ headers: true }))
                .on('data', (row) => rows.push(row))
                .on('end', () => resolve())
                .on('error', (error) => reject(error));
        });
        rows.forEach((row, index) => {
            // Check for required columns
            if (!row['Serial Number'] || !row['Product Name'] || !row['Input Image Urls']) {
                errors.push(`Row ${index + 1}: Missing required columns.`);
            }
        });
    }
    catch (error) {
        errors.push('Error fetching or parsing the CSV file.');
    }
    return errors;
});
exports.default = validateCSV;
//# sourceMappingURL=validateCSV.js.map