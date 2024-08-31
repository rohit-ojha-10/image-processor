import Queue from "bull";
import processImages from "./processImages";
const imageQueue = new Queue("imageQueue", {
  redis: {
    password: process.env.REDIS_PW,
    host: process.env.REDIS_HOST,
    port: 18362,
  },
});

imageQueue.process("processImages", processImages);

export default imageQueue;
