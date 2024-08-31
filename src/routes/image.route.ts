import { Router } from 'express';
import multer from 'multer';
import { uploadFile } from '../controllers/image.controller';
import dotenv from 'dotenv';
dotenv.config();
const imageRouter = Router();

const upload = multer({ dest: process.env.UPLOAD_DEST ||'src/uploads/' });

imageRouter.post('/upload', upload.single('file'), uploadFile);

export default imageRouter;
