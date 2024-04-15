const axios = require("axios")
const CacheStorage = require(`./out/cache/${process.env.CACHE_STORAGE}`)

class NeedCacheError extends Error {
  constructor(cache) {
    super("This request is already cached.")
    this.cache = cache
  }
}

class Storage {
  static cacheStorage = new CacheStorage.default()
  static getInstance() {
    return this.cacheStorage
  }
}

axios.interceptors.request.use(
  async (config) => {
    let cache
    try {
      if (!await Storage.getInstance().has(config.url)) {
        return Promise.resolve(config)
      }
      // there is a delay depending on the network env(Redis servier)
      cache = await Storage.getInstance().match(config.url)
      if (cache == null) {
        return Promise.resolve(config)
      }
    } catch (error) {
      console.error(error)
      return Promise.resolve(config)
    }
    throw new NeedCacheError(cache)
  }
)

axios.interceptors.response.use(
  (response) => {
    Storage.getInstance().store(response.config.url, response.data)
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    // return response.data;// ts can not process type check
    return response;
  },
  (error) => error instanceof NeedCacheError ? Promise.resolve({ data: error.cache }) : Promise.reject(error)
);

module.exports = axios