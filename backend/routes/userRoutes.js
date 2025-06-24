import express from 'express';
import { saveUser } from '../controller/userController.js';
import { verifyAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Save user on first login (called from frontend after NextAuth login)
router.post('/save', saveUser);

// Admin-only: promote or demote users
// router.put('/update-role', verifyAdmin, updateUserRole);

export default router;
