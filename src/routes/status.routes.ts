import express, { Request, Response, Router } from 'express';
import imageQueue from '../services/queue/imageQueue';

const statusRouter = Router();

statusRouter.get('/:requestId', async (req: Request, res: Response) => {
    const { requestId } = req.params;

    try {
        const job = await imageQueue.getJob(requestId);
        if (job) {
            const state = await job.getState();
            res.json({ requestId, state });
        } else {
            res.status(404).send('Job not found');
        }
    } catch (error) {
        console.error('Error fetching job status:', error);
        res.status(500).send('Internal Server Error');
    }
});

export default statusRouter;
