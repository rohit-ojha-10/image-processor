import { Router } from 'express';
import multer from 'multer';
import { uploadFile } from '../controllers/image.controller';

const imageRouter = Router();
const upload = multer({ dest: 'src/uploads/' });

imageRouter.post('/upload', upload.single('file'), uploadFile);

export default imageRouter;
