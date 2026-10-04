import { Router } from 'express';
import {
  getIncome,
  getIncomeById,
  createIncome,
  updateIncome,
  deleteIncome,
} from '../controllers/incomeController.js';
import { authenticate } from '../middleware/auth.js';
import { validateIncome } from '../middleware/validator.js';

const router = Router();

router.use(authenticate);

router.get('/', getIncome);
router.get('/:id', getIncomeById);
router.post('/', validateIncome, createIncome);
router.put('/:id', updateIncome);
router.delete('/:id', deleteIncome);

export default router;
