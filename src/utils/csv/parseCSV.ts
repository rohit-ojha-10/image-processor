import fs from 'fs';
import path from 'path';
import { parse } from 'fast-csv';

const parseCSV = (filePath: string): Promise<any[]> => {
    return new Promise((resolve, reject) => {
        // Check if the file exists before attempting to read it
        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (err) {
                return reject(new Error(`File not found: ${filePath}`));
            }

            const results: any[] = [];

            fs.createReadStream(filePath)
                .pipe(parse({ headers: true }))
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

export default parseCSV;
