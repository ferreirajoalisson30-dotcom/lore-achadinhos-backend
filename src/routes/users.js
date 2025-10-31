import express from 'express';
import { listUsers, createUser, updateUser, removeUser } from '../controllers/userController.js';
import { requireAuth } from '../middleware/auth.js';
const router = express.Router();
router.get('/', requireAuth('admin'), listUsers);
router.post('/', requireAuth('admin'), createUser);
router.put('/:id', requireAuth('admin'), updateUser);
router.delete('/:id', requireAuth('admin'), removeUser);
export default router;
