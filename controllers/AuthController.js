// Import necessary modules and utilities
import { v4 as uuidv4 } from 'uuid';
import sha1 from 'sha1';
import { ObjectId } from 'mongodb';
import db from '../utils/db';
import redisClient from '../utils/redis';

// function to return existing user if they exist, returns false it not exists
async function getUserByEmailAndPwd(email, pwd) {
  try {
    // Attempt to find user with given email in database
    const existingUser = await db.usersCollection.findOne({ email, password: pwd });
    // for debugging
    console.log('existingUser', existingUser);
    console.log('email', email);
    console.log('pwd', pwd);

    // If a user with given email and hashed password is found
    if (existingUser) {
      return existingUser;
    }

    // If no user is found or password doesn't match, return false
    return false;
  } catch (error) {
    // Log an error message if an error occurs during database operation
    console.log('Error in compare', error.message);

    // Return false to indicate an error or no user found
    return false;
  }
}

// Define AuthController class
class AuthController {
  // Endpoint to sign-in user and generate a new authentication token
  static async getConnect(req, res) {
    const authHeader = req.header('Authorization');
    // for debugging
    console.log('authHeader', authHeader);
    try {
      // Check if Authorization header is present and starts with 'Basic '
      if (!authHeader || !authHeader.startsWith('Basic ')) {
        // for debugging
        console.log('authHeader', authHeader);
        const errMsg = { error: 'Unauthorized' };
        return res.status(401).json(errMsg);
      }

      // split credentials from space to seperate 'Basic' and credentials
      const credentials = authHeader.split(' ')[1];
      // decode base64 from header basic auth credentials
      const decodedCredentials = Buffer.from(credentials, 'base64').toString('utf-8');
      // split decoded strings to email and password
      const [email, password] = decodedCredentials.split(':');
      // debugging
      console.log('email', email, 'password', password);

      // Check if email or password is missing
      if (!email || !password) {
        const errMsg = { error: 'Unauthorized' };
        return res.status(401).json(errMsg);
      }

      // Hash password using SHA1
      const sha1Hashed = sha1(password);

      // userExists is existing User or a boolean(user=exists, false=not exist)
      const userExists = await getUserByEmailAndPwd(email, sha1Hashed);
      // debugging
      console.log('userExists', userExists);

      // If user doesn't exist, return an unauthorized error
      if (userExists === false) {
        // for debugging
        console.log('userExists', userExists);
        const errMsg = { error: 'Unauthorized' };
        return res.status(400).json(errMsg);
      }

      // Generate new authentication token
      const token = uuidv4();

      // Create key for Redis storage
      const key = `auth_${token}`;

      // Set user ID in Redis with generated token for 24 hours
      const duration = 24 * 60 * 60;

      // make a fresh call to mogondb to retrieve user document
      const user = await db.usersCollection.findOne({ email });
      // debugging
      console.log('user', user);

      // check if user's ObjectId is valid
      if (user && ObjectId.isValid(user._id)) {
        // Store user ID in Redis with generated token for 24 hours
        await redisClient.set(key, user._id.toString(), duration);
      }
      // Return token in response
      return res.status(200).json({ token });
    } catch (error) {
      // Log an error message if an error occurs during operation
      console.error('Error when setting header', error.message);
      // Return a 500 Internal Server Error response
      return res.status(500).json({ error: error.message });
    }
  }

  // Endpoint to sign-out user based on token
  static async getDisconnect(req, res) {
    const { 'x-token': token } = req.headers;

    try {
      // Check if token is present
      if (!token) {
        console.log('No token found', token);
        return res.status(401).json({ error: 'Unauthorized' });
      }
      // bcb7e6df-a282-4639-8849-2f217b102ee2

      // Create key for Redis storage
      const key = `auth_${token}`;
      // Retrieve user ID associated with token from Redis
      const userId = await redisClient.get(key);

      // log key and userId to console for debugging purpose
      // console.log(`key = ${key}, userId=${userId}`);

      // If no user ID is found, return an unauthorized error
      if (!userId) {
        console.log('No user id', userId);
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Delete token from Redis and return a 204 No Content response
      await redisClient.del(key);
      return res.status(204).end();
    } catch (error) {
      // Log an error message if an error occurs during operation
      console.error('Error while trying to disconnect', error.message);
      // Return a 500 Internal Server Error response
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

// Export AuthController class
export default AuthController;
