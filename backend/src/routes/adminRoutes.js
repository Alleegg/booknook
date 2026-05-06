import express from 'express';
import { adminController } from '../controllers/adminController.js';
import { requireAdmin, requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.use(requireAuth, requireAdmin);

router.get('/stats', (req, res) => adminController.getStats(req, res));
router.get('/users', (req, res) => adminController.getUsers(req, res));

export default router;
