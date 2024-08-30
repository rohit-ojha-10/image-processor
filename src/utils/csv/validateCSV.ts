import fs from 'fs';
import { parse } from 'fast-csv';

// Validate if image URLs are enclosed in quotes
const validateCSV = async (filePath: string): Promise<string[]> => {
    const errors: string[] = [];
    
    try {
        const rows = await new Promise<any[]>((resolve, reject) => {
            const results: any[] = [];
            fs.createReadStream(filePath)
                .pipe(parse({ headers: true }))
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
    } catch (error) {
        errors.push('Error reading or parsing the CSV file.');
    }
    
    return errors;
};

export default validateCSV;
