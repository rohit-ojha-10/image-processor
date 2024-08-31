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
const parseCSV = (fileUrl) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch the CSV file from Cloudinary
        const response = yield axios_1.default.get(fileUrl, { responseType: 'stream' });
        const results = [];
        const stream = response.data;
        return new Promise((resolve, reject) => {
            stream
                .pipe((0, fast_csv_1.parse)({ headers: true }))
                .on('data', (row) => {
                // Filter out empty rows
                if (Object.values(row).some(value => value !== null && value !== '')) {
                    results.push(row);
                }
            })
                .on('end', () => resolve(results))
                .on('error', (error) => {
                console.error('Error parsing CSV:', error);
                reject(error);
            });
        });
    }
    catch (error) {
        console.error('Error fetching CSV from URL:', error);
        throw new Error(`Error fetching CSV from URL: ${fileUrl}`);
    }
});
exports.default = parseCSV;
//# sourceMappingURL=parseCSV.js.map