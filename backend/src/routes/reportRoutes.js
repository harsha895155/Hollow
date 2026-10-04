import { Router } from 'express';
import { getReports } from '../controllers/reportController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/', getReports);

export default router;
