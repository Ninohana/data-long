import Cache from "./Cache"

export default interface CacheStorage {
    hasCache(key: string): boolean

    getCache(key: string): Cache<any>

    setCache(key: string, value: Cache<any>): void
}

export class DiskCacheStorage implements CacheStorage {
    private caches = {} as any

    hasCache(key: string): boolean {
        return this.caches.hasOwnProperty(key)
    }

    getCache(key: string): any {
        return this.caches[key];
    }

    setCache(key: string, value: Cache<any>): void {
        this.caches[key] = value;
    }

    delCache(key: string): void {
        delete this.caches[key]
    }
}