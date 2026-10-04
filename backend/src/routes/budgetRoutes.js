import { Router } from 'express';
import {
  getBudgets,
  createBudget,
  updateBudget,
  deleteBudget,
} from '../controllers/budgetController.js';
import { authenticate } from '../middleware/auth.js';
import { validateBudget } from '../middleware/validator.js';

const router = Router();

router.use(authenticate);

router.get('/', getBudgets);
router.post('/', validateBudget, createBudget);
router.put('/:id', updateBudget);
router.delete('/:id', deleteBudget);

export default router;
