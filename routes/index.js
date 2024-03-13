import express from 'express';
import AppController from '../controllers/AppController';

const router = express.Router();

router.get('/status', async (req, res) => {
  try {
    const status = await AppController.getStatus();
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/stats', async (req, res) => {
  try {
    const stats = await AppController.getStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
