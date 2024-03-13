import sha1 from 'sha1';
import uuidv4 from 'uuid/v4'; // Import uuidv4 for generating random tokens
import redisClient from '../utils/redis'; // Import redisClient
import User from '../models/User';

const UsersController = {
  async postNew(req, res) {
    try {
      const { email, password } = req.body;

      // Check if email and password are provided
      if (!email) {
        return res.status(400).json({ error: 'Missing email' });
      }
      if (!password) {
        return res.status(400).json({ error: 'Missing password' });
      }

      // Check if email already exists in database
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'Already exist' });
      }

      // Hash password using SHA1
      const hashedPassword = sha1(password);

      // Create new user
      const newUser = new User({ email, password: hashedPassword });
      await newUser.save();

      // Respond with new user's id and email
      return res.status(201).json({ id: newUser._id, email: newUser.email });
    } catch (error) {
      console.error('Error creating user:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  async getMe(req, res) {
    try {
      // Get user id from token
      const { token } = req.headers;

      // Retrieve user id from Redis using token
      const userId = await redisClient.get(`auth_${token}`);

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Find user in database
      const user = await User.findById(userId);

      if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Respond with user's id and email
      return res.status(200).json({ id: user._id, email: user.email });
    } catch (error) {
      console.error('Error getting user:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};

export default UsersController;
