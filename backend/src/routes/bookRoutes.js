import express from 'express';
import { bookController } from '../controllers/bookController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.use(requireAuth);

router.get('/', (req, res) => bookController.getMyBooks(req, res));
router.post('/', (req, res) => bookController.createBook(req, res));
router.get('/:id', (req, res) => bookController.getBookById(req, res));

export default router;
