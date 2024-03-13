import { MongoClient } from 'mongodb';

// MongoDB connection URI
const uri = 'mongodb://localhost:27017';

// Create a new MongoClient
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Connect to MongoDB
async function connect() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  }
}

// Get MongoDB client
function getClient() {
  return client.db(); // Return database object instead of client
}

export { connect, getClient };
