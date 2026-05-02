import express from 'express';
import { prisma } from '../prisma.js';
import { requireAdmin, requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.use(requireAuth, requireAdmin);

router.get('/stats', async (_req, res) => {
  const [usersCount, booksCount, adminsCount] = await Promise.all([
    prisma.user.count(),
    prisma.book.count(),
    prisma.user.count({ where: { role: 'ADMIN' } }),
  ]);

  return res.json({
    usersCount,
    booksCount,
    adminsCount,
  });
});

router.get('/users', async (_req, res) => {
  const users = await prisma.user.findMany({
    select: { id: true, email: true, name: true, role: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  });
  return res.json(users);
});

export default router;
