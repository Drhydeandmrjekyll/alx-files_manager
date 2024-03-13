// Import necessary modules and utilities
import sha1 from 'sha1';
import { ObjectId } from 'mongodb';
import dbclient from '../utils/db';
import redisClient from '../utils/redis';
import userQueue from '../worker';

// Define UsersController class
class UsersController {
  // Endpoint: POST /users
  static async postNew(req, res) {
    try {
      // Extract email and password from request body
      const { email, password } = req.body;

      // Check if email is missing
      if (!email) {
        return res.status(400).json({ error: 'Missing email' });
      }

      // Check if password is missing
      if (!password) {
        return res.status(400).json({ error: 'Missing password' });
      }

      // Check if email already exists in database
      const existingUser = await dbclient.usersCollection.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'Already exist' });
      }

      // Hash password using SHA1
      const hashedPassword = sha1(password);

      // Create new user object
      const newUser = {
        email,
        password: hashedPassword,
      };

      // Insert new user into 'users' collection
      const result = await dbclient.usersCollection.insertOne(newUser);

      // Enqueue job to send Welcome email
      await userQueue.add({ userId: result.insertedId });

      // Send the new user as a JSON response with a status code of 201 (Created)
      return res.status(201).json({ id: result.insertedId, email });
    } catch (error) {
      // Handle errors and send a 500 Internal Server Error response
      console.error('Error creating new user:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  // Endpoint: GET /users/me
  // Retrieve user information based on provided token
  static async getMe(req, res) {
    // Extract token from the request headers
    const { 'x-token': token } = req.headers;
    // log token to console for debugging purpose
    // console.log(token);

    try {
      // Check if token is missing
      if (!token) {
        return res.status(401).json({ error: 'Unauthorised' });
      }

      // Construct key used to store user ID in Redis
      const key = `auth_${token}`;
      // Retrieve user ID from Redis
      const userId = await redisClient.get(key);
      // log userId to console for debuggging purpose
      // console.log(`UserId: ${userId}`);

      // Check if user ID is not found in Redis
      if (!userId) {
        // added for debugging purpose
        // console.error('Error fetching userId');
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Attempt to find a user in 'usersCollection' with given userId
      const user = await dbclient.usersCollection.findOne({ _id: new ObjectId(userId) });
      // log user to console for debuggging purpose
      // console.log(`user: ${user._id}`);

      // Check if user is not found in database
      if (user === false) {
        // added for debugging purpose
        console.error('Error fetching user by Id');
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Respond with user's email and ID if everything is successful
      return res.status(200).json({ id: user._id, email: user.email });
    } catch (error) {
      // Handle any unexpected errors and respond with a 500 Internal Server Error
      console.error('Error in getMe', error.messsage);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

// Export UsersController class for use in other modules
export default UsersController;
