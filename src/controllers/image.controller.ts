import { v4 as uuidv4 } from "uuid";
import validateCSV from "../utils/csv/validateCSV";
import path from "path";
import { Request, Response } from "express";
import imageQueue from "../services/queue/imageQueue";

export const uploadFile = async (
  req: Request & { file: Express.Multer.File },
  res: Response
) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  try {
    const filePath = path.join(__dirname, "../uploads", req.file.filename);

    // Validate the CSV file
    const errors = await validateCSV(filePath);
    if (errors?.length > 0) {
      return res.status(400).json({ errors });
    }

    // Generate a unique request ID
    const requestId = uuidv4();

    // Add the job to the queue
    await imageQueue.add(
      "processImages",
      {
        filePath,
        requestId,
      },
      {
        jobId: requestId,
      }
    );

    // returning the requestId immediately...
    res.json({ requestId });
  } catch (error) {
    console.error("Error processing the file:", error);
    res.status(500).send("Internal Server Error");
  }
};
