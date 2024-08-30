import axios from 'axios';
import fs from 'fs';
import sharp from 'sharp';
import path from 'path';

const compressImage = async (imageUrl: string): Promise<string> => {
    const response = await axios({ url: imageUrl, responseType: 'arraybuffer' });
    const inputPath = path.join(__dirname, '../tmp/input.jpg');
    const outputPath = path.join(__dirname, '../tmp/output.jpg');

    fs.writeFileSync(inputPath, response.data);

    await sharp(inputPath)
        .resize({ width: 800 }) // Resize image
        .jpeg({ quality: 50 }) // Compress image
        .toFile(outputPath);

    // Cleanup
    fs.unlinkSync(inputPath);

    // For demonstration, we return the path. In a real scenario, you'd upload the file to a server or cloud storage.
    return outputPath;
};

export { compressImage };
