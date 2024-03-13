import { getClient } from '../utils/db';

const AppController = {
  async getStatus() {
    const client = getClient();
    try {
      await client.connect();
      return { redis: true, db: true };
    } catch (error) {
      return { redis: false, db: false };
    } finally {
      await client.close();
    }
  },

  async getStats() {
    const client = getClient();
    try {
      await client.connect();
      const db = client.db();
      const usersCount = await db.collection('users').countDocuments();
      const filesCount = await db.collection('files').countDocuments();
      return { users: usersCount, files: filesCount };
    } catch (error) {
      console.error('Error getting stats:', error);
      throw error;
    } finally {
      await client.close();
    }
  },
};

export default AppController;
