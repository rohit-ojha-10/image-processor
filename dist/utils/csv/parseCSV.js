"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const fast_csv_1 = require("fast-csv");
const parseCSV = (filePath) => {
    return new Promise((resolve, reject) => {
        // Check if the file exists before attempting to read it
        fs_1.default.access(filePath, fs_1.default.constants.F_OK, (err) => {
            if (err) {
                return reject(new Error(`File not found: ${filePath}`));
            }
            const results = [];
            fs_1.default.createReadStream(filePath)
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
    });
};
exports.default = parseCSV;
//# sourceMappingURL=parseCSV.js.map