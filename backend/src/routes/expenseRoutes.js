import { Router } from 'express';
import {
  getExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
} from '../controllers/expenseController.js';
import { authenticate } from '../middleware/auth.js';
import { validateExpense } from '../middleware/validator.js';

const router = Router();

router.use(authenticate);

router.get('/', getExpenses);
router.get('/:id', getExpenseById);
router.post('/', validateExpense, createExpense);
router.put('/:id', updateExpense);
router.delete('/:id', deleteExpense);

export default router;
