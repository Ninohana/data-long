import Cache from "./Cache"
import { ResponseDataCache } from "./Cache"
import fs from 'fs'
import { v4 as uuid } from "uuid"

export default interface CacheStorage<T> {
    has(key: string): boolean

    match(key: string): Cache<T>

    store(key: string, value: Cache<T>): void

    delete(key: string): boolean
}

export class DiskCacheStorage implements CacheStorage<string> {
    private caches = {} as any

    has(key: string): boolean {
        return this.caches.hasOwnProperty(key)
    }

    match(key: string): Cache<string> {
        if (this.has(key)) {
            const data = fs.readFileSync(this.caches[key])
            const cache = JSON.parse(data.toString())
            return new ResponseDataCache(cache.data, Math.max(0, cache.time - new Date().getTime()))
        }
        throw new Error("cached bu not found")
    }

    store(key: string, value: Cache<string>): void {
        const path = './_response_data'
        try {
            fs.mkdirSync(path)
        } catch (e) {
            ;
        }
        const file = `${path}/${uuid()}`
        fs.writeFile(file, JSON.stringify(value), (err) => {
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