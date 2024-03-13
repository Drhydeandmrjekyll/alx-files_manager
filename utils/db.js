// Import MongoClient from 'mongodb' library
const { MongoClient } = require('mongodb');

// Define constants for MongoDB connection
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || 27017;
const DB_DATABASE = process.env.DB_DATABSAE || 'files_manager';

// Create MongoDB connection URI based on constants
const URI = `mongodb://${DB_HOST}:${DB_PORT}/${DB_DATABASE}`;

// Class representing MongoDB client
class DBClient {
  // Constructor for initializing MongoDB client
  constructor() {
    // Creates new instance of MongoClient with connection URI
    this.client = new MongoClient(URI);

    this.client.connect()
      .then(() => {
        // Log a message when connected successfully
        // console.log('Connected to MongoDB');

        // Get a reference to database and initialize collections
        this.db = this.client.db(DB_DATABASE);
        this.usersCollection = this.db.collection('users');
        this.filesCollection = this.db.collection('files');
      })
      .catch((err) => console.error('Error connecting to MongoDB', err));
  }

  // Method to check if MongoDB connection is alive
  isAlive() {
    return Boolean(this.db);
  }

  // Method to asynchronously get number of users in 'users' collection
  async nbUsers() {
    try {
      // Use countDocuments method to get count of documents in 'users' collection
      const count = await this.usersCollection.countDocuments();
      return count;
    } catch (error) {
      // Log an error message if an error occurs during operation
      console.error('Error counting users: ', error);
      return -1;
    }
  }

  // Method to asynchronously get number of files in 'files' collection
  async nbFiles() {
    try {
      // Use countDocuments method to get count of documents in 'files' collection
      const count = await this.filesCollection.countDocuments();
      return count;
    } catch (error) {
      // Log an error message if an error occurs during operation
      console.error('Error counting files: ', error);
      return -1;
    }
  }
}

// Create an instance of DBClient class to represent MongoDB client
const dbclient = new DBClient();

// Exports created instance for use in other parts of application
export default dbclient;
