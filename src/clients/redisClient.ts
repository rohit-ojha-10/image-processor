import { createClient } from 'redis';
import dotenv from 'dotenv';
dotenv.config();
export const redisClient = createClient({
    password: process.env.REDIS_PW,
    socket: {
        host: process.env.REDIS_HOST,
        port: 18362
    }
});

redisClient.connect().catch(console.error);

// Ensure to handle client disconnection properly
process.on('SIGINT', async () => {
  await redisClient.quit();
  process.exit(0);
});