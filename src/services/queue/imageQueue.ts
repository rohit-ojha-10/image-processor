import Queue from 'bull';
import validateCSV from '../../utils/csv/validateCSV';
import parseCSV from '../../utils/csv/parseCSV';
import cloudinary from '../cloudinary';
import compressImage from '../../utils/image/compressImage';
import { redisClient } from '../../clients/redisClient';

const imageQueue = new Queue('imageQueue', {
  redis: {
    host: 'localhost',
    port: 6379,
  },
});

  imageQueue.process('processImages', async (job) => {
    const { filePath, requestId } = job.data;
    console.log(`Job ${requestId} started processing file: ${filePath}`);

    // Validate the CSV file
    const errors = await validateCSV(filePath);
    if (errors.length > 0) {
        throw new Error(`Validation errors: ${errors.join(', ')}`);
    }
    //stagger
    await new Promise((res) => setTimeout(() => res(true), 10_000));
    // Parse the CSV file
    const csvData = await parseCSV(filePath);

    // Process each image URL
    const totalImages = csvData.reduce((count, row) => count + row['Input Image Urls'].split(',').length, 0);
    let processedImages = 0;
    const uploadedUrls: { [key: string]: string[] } = {};

    for (const row of csvData) {
        const imageUrls = row['Input Image Urls'].split(',').map(url => url.trim().replace(/"/g, ''));
        const outputUrls: string[] = [];

        for (const imageUrl of imageUrls) {
            // Compress the image  and upload it to Cloudinary
            const {inputPath, outputPath: compressedImagePath} = await compressImage(imageUrl);
            const result = await cloudinary.uploader.upload(compressedImagePath);
            // console.log(`Uploaded image: ${result.secure_url}`);
            outputUrls.push(result.secure_url);
            await redisClient.hSet(`job:${requestId}`, row['Product Name'], JSON.stringify(outputUrls));
            
            // Update progress
            processedImages += 1;
            const progressPercentage = Math.round((processedImages / totalImages) * 100);
            job.progress(progressPercentage);
        }

        uploadedUrls[row['Product Name']] = outputUrls;
    }

    console.log(`Job ${requestId} processed successfully.`);
    return uploadedUrls;
});

export default imageQueue;
