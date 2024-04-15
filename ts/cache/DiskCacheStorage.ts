import { SyncCacheStorage } from "./CacheStorage"
import { ExpirableCache } from "./Cache"
import fs from 'fs'
import { v4 as uuid } from "uuid"

export class ResponseDataCache extends ExpirableCache<string> {
    data: string

    constructor(data: string, time?: number) {
        super(time)
        this.data = data
    }

    getData(): string {
        return this.data
    }
}

export default class DiskCacheStorage implements SyncCacheStorage<string> {
    private caches = {} as any

    has(key: string): boolean {
        return this.caches.hasOwnProperty(key)
    }

    match(key: string): string {
        const cache = JSON.parse(fs.readFileSync(this.caches[key]).toString())
        const rdc = new ResponseDataCache(cache.data, Math.max(0, cache.time - new Date().getTime()))
        if (rdc.isExpire()) {
            this.delete(key)
            throw new Error("cache expired")
        }
        return rdc.getData()
    }

    store(key: string, value: string): void {
        const path = './_response_data'
        try {
            fs.mkdirSync(path)
        } catch (e) {
            ;
        }
        const file = `${path}/${uuid()}`
        const rdc = new ResponseDataCache(value, Number(process.env.CACHE_EXPIRE_TIME) * 1000)
        fs.writeFile(file, JSON.stringify(rdc), (err) => {
            if (err) {
                console.error(err)
            } else {
                this.caches[key] = file
            }
        })
    }

    delete(key: string): boolean {
        fs.unlink(this.caches[key], (err) => {
            if (err) {
                console.error(err)
            }
        })
        return delete this.caches[key]
    }
}