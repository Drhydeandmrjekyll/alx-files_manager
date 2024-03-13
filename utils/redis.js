import redis from 'redis';
import { promisify } from 'util';

class RedisClient {
  constructor() {
    this.client = redis.createClient();
    this.asyncGet = promisify(this.client.get).bind(this.client);
    this.asyncSetex = promisify(this.client.setex).bind(this.client);
    this.asyncDel = promisify(this.client.del).bind(this.client);
    this.asyncQuit = promisify(this.client.quit).bind(this.client);

    this.client.on('error', (err) => {
      console.log('erro in connection custom', err.message);
    });
  }

  /**
  * Checks if Redis client is alive.
  *
  * @returns {boolean} True if client is alive, false otherwise.
  */
  isAlive() {
    return this.client.connected && this.client.ready;
  }

  /**
  * Gets value associated with specified key from Redis server.
  *
  * @param {string} key - The key to get value for.
  * @returns {Promise<string>} A promise that resolves to value associated with
  *                           the specified key, or null if  key does not exist.
  */
  async get(key) {
    try {
      const value = await this.asyncGet(key);
      return value;
    } catch (error) {
      console.error('Error in get method', error.message);
      throw error;
    }
  }

  /**
  * Sets the value associated with specified key in Redis server.
  *
  * @param {string} key - The key to set value for.
  * @param {string} value - The value to set.
  * @param {number} duration - The duration in seconds for which key should exist.
  */
  async set(key, value, duration) {
    try {
      await this.asyncSetex(key, duration, value);
    } catch (error) {
      console.error('Error in set method', error.message);
      throw error;
    }
  }

  /**
  * Deletes value associated with specified key from Redis server.
  *
  * @param {string} key - The key to delete the value for.
  * @returns {Promise<void>} A promise that resolves when value has been deleted.
  */
  async del(key) {
    try {
      await this.asyncDel(key);
    } catch (error) {
      console.error('Error in del method', error.message);
      throw error;
    }
  }

  /**
  * Closes connection to Redis server.
  *
  * @returns {Promise<void>} A promise that resolves when connection has closed.
  */
  async close() {
    try {
      await this.asyncQuit();
    } catch (error) {
      console.error('Error with close method', error.message);
      throw error;
    }
  }
}

const redisClient = new RedisClient();
export default redisClient;
