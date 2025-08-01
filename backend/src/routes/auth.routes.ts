import { Router } from 'express';
import { body } from 'express-validator';

const router = Router();

// Login route
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  // TODO: Add login controller
);

// Register route (for admin only)
router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    body('role').isIn(['leader', 'manager']).withMessage('Invalid role'),
  ],
  // TODO: Add register controller
);

export default router; 