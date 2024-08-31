
import axios from 'axios';
import sharp from 'sharp';
import cloudinary from '../../clients/cloudinary';

// Function to compress the image and upload it to Cloudinary
const compressAndUploadImage = async (imageUrl: string): Promise<string> => {
    try {
        // Download image
        const response = await axios({ url: imageUrl, responseType: 'arraybuffer' });
        const imageBuffer = Buffer.from(response.data);

        // Compress image
        const compressedImageBuffer = await sharp(imageBuffer)
            .resize({ width: 800 }) // Resize image
            .jpeg({ quality: 50 })  // Compress image
            .toBuffer();

        // Upload to Cloudinary
        const result = await new Promise<any>((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });

            stream.end(compressedImageBuffer);
        });

        console.log(`Uploaded image to Cloudinary: ${result.secure_url}`);
        return result.secure_url;

    } catch (error) {
        console.error('Error processing image:', imageUrl, error);
        throw error;
    }
};

export default compressAndUploadImage;
