import dbClient from '../utils/db';
import redisClient from '../utils/redis';

const AppController = {
  getStatus: async (req, res) => {
    const redisStatus = redisClient.isAlive();
    const dbStatus = dbClient.isAlive();
    res.status(200).json({ redis: redisStatus, db: dbStatus });
  },

  getStats: async (req, res) => {
    try {
      const usersCount = await dbClient.nbUsers();
      const filesCount = await dbClient.nbFiles();
      res.status(200).json({ users: usersCount, files: filesCount });
    } catch (error) {
      console.error(`Error getting stats: ${error}`);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};

export default AppController;
