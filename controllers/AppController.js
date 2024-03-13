// Import Redis and MongoDB utilities
import redis from '../utils/redis';
import db from '../utils/db';

// Define AppController class
class AppController {
  // Endpoint: GET /status
  static async getStatus(req, res) {
    try {
      // Check if Redis and MongoDB are alive
      const isRedisAlive = await redis.isAlive();
      const isMongoDbAlive = await db.isAlive();

      // Prepare status object
      const status = {
        redis: isRedisAlive,
        db: isMongoDbAlive,
      };

      // Send status as a JSON response with a status code of 200
      res.status(200).json(status);
    } catch (error) {
      // Handle errors and send a 500 Internal Server Error response
      console.error('Error checking status:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  // Endpoint: GET /stats
  static async getStats(req, res) {
    try {
      // Retrieve number of users and files from MongoDB
      const usersCount = await db.nbUsers();
      const filesCount = await db.nbFiles();

      // Prepare users and files statistics object
      const usersAndFiles = {
        users: usersCount,
        files: filesCount,
      };

      // Send statistics as a JSON response with a status code of 200
      res.status(200).json(usersAndFiles);
    } catch (error) {
      // Handle errors and send a 500 Internal Server Error response
      console.error('Error getting stats:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

// Export AppController class for use in other modules
export default AppController;
