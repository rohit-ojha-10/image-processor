import { Request, Response } from "express";
import imageQueue from "../services/queue/imageQueue";
import { redisClient } from "../clients/redisClient";
import { status } from "../utils/constants";

const getStatus = async (req: Request, res: Response) => {
  const { requestId } = req.params;

  try {
    const job = await imageQueue.getJob(requestId);
    if (job) {
      const state = await job.getState();
      const progress = job.progress(); // Get the progress percentage

      // Fetch the uploaded URLs from Redis
      try {
        const data = await redisClient.hGetAll(`job:${requestId}`);
        const uploadedUrls = data
          ? Object.keys(data).reduce((acc, key) => {
              acc[key] = JSON.parse(data[key]);
              return acc;
            }, {} as { [key: string]: string[] })
          : {};

        res.json({
          requestId,
          status: status[state],
          progress,
          uploadedUrls,
        });
      } catch (err) {
        console.error("Error fetching data from Redis:", err);
        res.status(500).send("Internal Server Error");
      }
    } else {
      res.status(404).send("Job not found");
    }
  } catch (error) {
    console.error("Error fetching job status:", error);
    res.status(500).send("Internal Server Error");
  }
};
export default getStatus;
