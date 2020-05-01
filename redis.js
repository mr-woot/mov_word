/**
 * Redis Client
 */
class Redis {
  constructor() {
    const redis = require("redis");
    const bluebird = require("bluebird");
    bluebird.promisifyAll(redis);
    const client = redis.createClient();
    const asyncRedis = require("async-redis");
    const asyncRedisClient = asyncRedis.decorate(client);
    this.redis = redis;
    this.client = asyncRedisClient;
  }

  get getClient() {
    return this.client;
  }
}

module.exports = new Redis();
