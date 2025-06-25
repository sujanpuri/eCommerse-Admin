import express from 'express';
import { getAllUsers, saveUser, updateLoggedInUser, updateUserRole } from '../controller/userController.js';
import { verifyAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Save user on first login (called from frontend after NextAuth login)
router.post('/save', saveUser);

router.get('/', getAllUsers);

// Admin-only: promote or demote users
router.put('/update-role', verifyAdmin, updateUserRole);

router.put('/edit', updateLoggedInUser);

export default router;
