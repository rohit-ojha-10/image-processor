import axios from 'axios';
import fs from 'fs-extra';
import sharp from 'sharp';
import path from 'path';

const TEMP_DIR = path.join(__dirname, '../tmp');

// Ensure tmp directory exists
fs.ensureDirSync(TEMP_DIR);

const compressImage = async (imageUrl: string): Promise<{inputPath: string, outputPath: string}> => {
    const uniqueId = Date.now().toString(); // Unique identifier for each file
    const inputPath = path.join(TEMP_DIR, `input-${uniqueId}.jpg`);
    const outputPath = path.join(TEMP_DIR, `output-${uniqueId}.jpg`);

    try {
        // Download image
        const response = await axios({ url: imageUrl, responseType: 'arraybuffer' });
        fs.writeFileSync(inputPath, response.data);

        // Compress image
        await sharp(inputPath)
            .resize({ width: 800 }) // Resize image
            .jpeg({ quality: 50 })  // Compress image
            .toFile(outputPath);

        return { inputPath, outputPath };
    } catch (error) {
        console.error('Error processing image:', imageUrl, error);
        throw error;
    }
};
export default  compressImage;