import Queue from 'bull';
import validateCSV from '../../utils/csv/validateCSV';
import parseCSV from '../../utils/csv/parseCSV';

const imageQueue = new Queue('imageQueue', {
  redis: {
    host: 'localhost',
    port: 6379,
  },
});
imageQueue.process('processImages', async (job) => {
    const { filePath, requestId } = job.data;
    console.log(`Processing job ${requestId} with file: ${filePath}`);
  
    try {
      const errors = await validateCSV(filePath);
      if (errors.length > 0) {
        throw new Error(`Validation errors: ${errors.join(', ')}`);
      }
  
      const csvData = await parseCSV(filePath);
    //   console.log(`CSV data for job ${requestId}:`, csvData);
  
      // Process images logic
      // ...
  
      console.log(`Job ${requestId} processed successfully.`);
    } catch (error) {
      console.error(`Error processing job ${requestId}:`, error);
    }
  });

export default imageQueue;
