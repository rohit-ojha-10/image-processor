import axios from 'axios';
import { parse } from 'fast-csv';
import { Readable } from 'stream';

const validateCSV = async (fileUrl: string): Promise<string[]> => {
    const errors: string[] = [];

    try {
        // Fetch the CSV file from Cloudinary
        const response = await axios.get(fileUrl, { responseType: 'stream' });

        const rows: any[] = [];
        const stream = response.data as Readable;

        await new Promise<void>((resolve, reject) => {
            stream
                .pipe(parse({ headers: true }))
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
    } catch (error) {
        errors.push('Error fetching or parsing the CSV file.');
    }

    return errors;
};

export default validateCSV;
