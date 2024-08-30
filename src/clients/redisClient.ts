import { createClient } from "redis";
export  const redisClient = createClient({
    url: 'redis://localhost:6379'
});
redisClient.connect().catch(console.error);

// Ensure to handle client disconnection properly
process.on('SIGINT', async () => {
  await redisClient.quit();
  process.exit(0);
});