import axios from 'axios';
import { parse } from 'fast-csv';
import { Readable } from 'stream';

const parseCSV = async (fileUrl: string): Promise<any[]> => {
    try {
        // Fetch the CSV file from Cloudinary
        const response = await axios.get(fileUrl, { responseType: 'stream' });

        const results: any[] = [];
        const stream = response.data as Readable;

        return new Promise((resolve, reject) => {
            stream
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
    } catch (error) {
        console.error('Error fetching CSV from URL:', error);
        throw new Error(`Error fetching CSV from URL: ${fileUrl}`);
    }
};

export default parseCSV;
