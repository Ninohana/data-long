const axios = require('axios')
const CacheStorage = require('./out/cache/CacheStorage')
const Cache = require("./out/cache/Cache")

class NeedCacheError extends Error {
  constructor(cache) {
    super("This request is already cached.")
    this.cache = cache
  }
}

class C {
  static diskCacheStorage = new CacheStorage.DiskCacheStorage()
  static hasCache(key) {
    return C.diskCacheStorage.has(key)
  }
  static setCache(key, cache) {
    C.diskCacheStorage.store(key, cache)
  }
  static getCache(key) {
    return C.diskCacheStorage.match(key)
  }
  static delCache(key) {
    C.diskCacheStorage.delete(key)
  }
}

axios.interceptors.request.use(
  (config) => {
    if (C.hasCache(config.url)) {
      const cache = C.getCache(config.url)
      if (cache.isExpire()) {
        C.delCache(config.url)
      } else {
        throw new NeedCacheError(cache.getData())
      }
    }
    return config
  }
)

axios.interceptors.response.use(
  (response) => {
    C.setCache(response.config.url, new Cache.ResponseDataCache(response.data, 1 * 60 * 60 * 1000))// an hour
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    // return response.data;// ts can not process type check
    return response;
  },
  (error) => error instanceof NeedCacheError ? Promise.resolve({ data: error.cache }) : Promise.reject(error)
);

module.exports = axios