import uuidv4 from 'uuid/v4'; // Import uuidv4 for generating random tokens
import redisClient from '../utils/redis'; // Import redisClient
import sha1 from 'sha1';
import User from '../models/User';

const AuthController = {
  async getConnect(req, res) {
    try {
      const credentials = req.headers.authorization.split(' ')[1];
      const [email, password] = Buffer.from(credentials, 'base64').toString('utf-8').split(':');

      // Find user by email and hashed password
      const hashedPassword = sha1(password);
      const user = await User.findOne({ email, password: hashedPassword });

      if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Generate a random token
      const token = uuidv4();

      // Store user ID in Redis with token as key for 24 hours
      redisClient.set(`auth_${token}`, user._id.toString(), 'EX', 86400);

      return res.status(200).json({ token });
    } catch (error) {
      console.error('Error connecting user:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  async getDisconnect(req, res) {
    try {
      const { token } = req.headers;

      // Retrieve user ID from Redis using token
      const userId = await redisClient.get(`auth_${token}`);

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Delete token in Redis
      redisClient.del(`auth_${token}`);

      return res.status(204).send();
    } catch (error) {
      console.error('Error disconnecting user:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};

export default AuthController;
