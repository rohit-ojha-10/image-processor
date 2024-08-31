import { v4 as uuidv4 } from "uuid";
import validateCSV from "../utils/csv/validateCSV";
import { Request, Response } from "express";
import cloudinary from '../clients/cloudinary'; // Adjust the import as needed
import { Readable } from 'stream';
import imageQueue from "../services/queue/imageQueue";

export const uploadFile = async (
  req: Request & { file: Express.Multer.File },
  res: Response
) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  try {
    // Upload the file to Cloudinary
    const uploadResult = await new Promise<{ secure_url: string }>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: 'auto' },
        (error, result) => {
          if (error) {
            return reject(error);
          }
          resolve(result);
        }
      );

      // Pipe the file buffer directly to Cloudinary
      Readable.from(req.file.buffer).pipe(uploadStream);
    });

    // The URL of the uploaded file on Cloudinary
    const fileUrl = uploadResult.secure_url;

    // Validate the CSV file if needed
    // Since we are uploading directly to Cloudinary, this step is for processing the uploaded file.
    await validateCSV(fileUrl);

    // Generate a unique request ID
    const requestId = uuidv4();

    // Add the job to the queue with the Cloudinary URL
    await imageQueue.add(
      "processImages",
      {
        fileUrl,
        requestId,
      },
      {
        jobId: requestId,
      }
    );

    // Return the request ID immediately
    res.json({ requestId });
  } catch (error) {
    console.error("Error processing the file:", error);
    res.status(500).send("Internal Server Error");
  }
};
