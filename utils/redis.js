import { createClient } from 'redis';
import { promisify } from 'util';

//Redis client
class RedisClient {
  // Constructor creates a new class instance
  constructor() {
    this.client = createClient();
    this.isClientConnected = true;
    this.client.on('error', (err) => {
      console.error('Redis client failed to connect:', err.message || err.toString());
      this.isClientConnected = false;
    });
    this.client.on('connect', () => {
      this.isClientConnected = true;
    });
  }

  /**
   * Checks if client connection to redis server is alive
   * @returns {boolean}
   */
  isAlive() {
    return this.isClientConnected;
  }

  /**
   * Gets the value of a key.
   * @param {String} key: the key of the item to get
   * @returns {String | Object}
   */
  async get(key) {
    return promisify(this.client.GET).bind(this.client)(key);
  }

  /**
   * Stores a key and value along with time of expiration
   * @param {String} key: The key of the item to store
   * @param {String | Number | Boolean} value: 
   * @param {Number} duration: Expiration time of the item in seconds.
   * @returns {Promise<void>}
   */
  async set(key, value, duration) {
    await promisify(this.client.SETEX)
      .bind(this.client)(key, duration, value);
  }

  /**
   * Deletes the value of a  key.
   * @param {String} key: The key of the item to remove
   * @returns {Promise<void>}
   */
  async del(key) {
    await promisify(this.client.DEL).bind(this.client)(key);
  }
}

const redisClient = new RedisClient();
module.exports = redisClient;
