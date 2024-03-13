import Queue from 'bull';
import { ObjectId } from 'mongodb';
import dbClient from './utils/db';

// Create Bull queue for processing file jobs
const fileQueue = new Queue('fileQueue');

// Process file queue
fileQueue.process(async (job) => {
  const { userId, fileId } = job.data;

  // Check if userId and fileId are present in the job
  if (!userId) {
    throw new Error('Missing userId');
  }
  if (!fileId) {
    throw new Error('Missing fileId');
  }

  // Find document in DB based on userId and fileId
  const db = await dbClient.getClient().db();
  const filesCollection = db.collection('files');
  const file = await filesCollection.findOne({ _id: ObjectId(fileId), userId });

  if (!file) {
    throw new Error('File not found');
  }

  // Generate thumbnails
  const thumbnailSizes = [500, 250, 100];
  const generateThumbnailPromises = thumbnailSizes.map(async (size) => {
    // Use image-thumbnail module to generate thumbnails
  });

  await Promise.all(generateThumbnailPromises);
});

// Create Bull queue for processing user jobs
const userQueue = new Queue('userQueue');

// Process user queue
userQueue.process(async (job) => {
  const { userId } = job.data;

  // Check if userId is present in the job
  if (!userId) {
    throw new Error('Missing userId');
  }

  // Find user document in DB based on userId
  const db = await dbClient.getClient().db();
  const usersCollection = db.collection('users');
  const user = await usersCollection.findOne({ _id: ObjectId(userId) });

  if (!user) {
    throw new Error('User not found');
  }

  // Print welcome message to console (in real life, you would send an email)
  console.log(`Welcome ${user.email}!`);
});

export { fileQueue, userQueue };
