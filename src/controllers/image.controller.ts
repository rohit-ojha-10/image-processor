import { v4 as uuidv4 } from "uuid";
import parseCSV from "../utils/csv/parseCSV";
import validateCSV from "../utils/csv/validateCSV";
import path from "path";
import { Request, Response } from "express";
import imageQueue from "../services/queue/imageQueue";

export const uploadFile = async (
  req: Request & { file: Express.Multer.File },
  res: Response
) => {
  // TODO: handle image upload
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

    // Parse the CSV file
    const csvData = await parseCSV(filePath);

    // Generate a unique request ID
    const requestId = uuidv4();

    // You can add further processing here, like saving to a database or enqueueing jobs

    await imageQueue.add(
      "processImages",
      {
        filePath,
        requestId,
      },
      {
        jobId: requestId, // Assign the requestId as the job ID
      }
    );

    res.json({ requestId });
  } catch (error) {
    console.error("Error processing the file:", error);
    res.status(500).send("Internal Server Error");
  }
};
