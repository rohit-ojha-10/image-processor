import { redisClient } from "../../clients/redisClient";
import { UPLOADS_DIR } from "../../controllers/image.controller";
import parseCSV from "../../utils/csv/parseCSV";
import validateCSV from "../../utils/csv/validateCSV";
import compressAndUploadImage from "../../utils/image/compressImage";
import fs from "fs-extra";
const processImages = async (job) => {
  try {
    const { filePath, requestId } = job.data;
    console.log(`Job ${requestId} started processing file: ${filePath}`);

    // Validate the CSV file
    const errors = await validateCSV(filePath);
    if (errors.length > 0) {
      throw new Error(`Validation errors: ${errors.join(", ")}`);
    }
    //stagger
    await new Promise((res) => setTimeout(() => res(true), 10_000));
    // Parse the CSV file
    const csvData = await parseCSV(filePath);

    // Process each image URL
    const totalImages = csvData.reduce(
      (count, row) => count + row["Input Image Urls"].split(",").length,
      0
    );
    let processedImages = 0;
    const uploadedUrls: { [key: string]: string[] } = {};

    for (const row of csvData) {
      const imageUrls = row["Input Image Urls"]
        .split(",")
        .map((url) => url.trim().replace(/"/g, ""));
      const outputUrls: string[] = [];

      for (const imageUrl of imageUrls) {
        const compressedImageUrl = await compressAndUploadImage(imageUrl);
        outputUrls.push(compressedImageUrl);
        await redisClient.hSet(
          `job:${requestId}`,
          row["Product Name"],
          JSON.stringify(outputUrls)
        );

        // Update progress
        processedImages += 1;
        const progressPercentage = Math.round(
          (processedImages / totalImages) * 100
        );
        job.progress(progressPercentage);
      }

      uploadedUrls[row["Product Name"]] = outputUrls;
    }
    await fs.emptyDirSync(UPLOADS_DIR);
    // await fs.emptyDirSync(TEMP_DIR); // Clear tmp directory

    console.log(`Job ${requestId} processed successfully.`);
    return uploadedUrls;
  } catch (error) {
    console.log(error);
  }
};
export default processImages;
