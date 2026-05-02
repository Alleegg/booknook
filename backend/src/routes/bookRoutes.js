import express from 'express';
import { prisma } from '../prisma.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.use(requireAuth);

router.get('/', async (req, res) => {
  const books = await prisma.book.findMany({
    where: { ownerId: Number(req.user.sub) },
    orderBy: { createdAt: 'desc' },
  });
  return res.json(books);
});

router.post('/', async (req, res) => {
  const { title, description } = req.body;
  if (!title || !description) {
    return res.status(400).json({ message: 'Title and description are required' });
  }
  const book = await prisma.book.create({
    data: {
      title,
      description,
      ownerId: Number(req.user.sub),
    },
  });
  return res.status(201).json(book);
});

router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const book = await prisma.book.findUnique({ where: { id } });
  if (!book) return res.status(404).json({ message: 'Book not found' });

  const isOwner = book.ownerId === Number(req.user.sub);
  const isAdmin = req.user.role === 'ADMIN';
  if (!isOwner && !isAdmin) {
    return res.status(403).json({ message: 'Access denied for this book' });
  }

  return res.json(book);
});

export default router;
