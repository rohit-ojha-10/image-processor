import { Router } from 'express';
import getStatus from '../controllers/status.controller';


const statusRouter = Router();
statusRouter.get('/:requestId', getStatus);

export default statusRouter;
