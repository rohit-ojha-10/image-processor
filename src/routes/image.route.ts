import { Router } from 'express';
import multer from 'multer';
import { uploadFile } from '../controllers/image.controller';

// Memory storage for Multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

const imageRouter = Router();

imageRouter.post('/upload', upload.single('file'), uploadFile);

export default imageRouter;
