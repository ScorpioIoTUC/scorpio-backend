import { Router } from 'express';

const router = Router();

router.all('/', (_req, res) => {
  res.status(501).json({ message: 'Packets module not implemented yet' });
});

export default router;