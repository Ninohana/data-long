import { kv } from "@vercel/kv"
import CacheStorage from "./CacheStorage"

export default class RedisCacheStorage implements CacheStorage<string> {

    async has(key: string): Promise<boolean> {
        return Promise.resolve(await kv.exists(key) == 1)
    }

    async match(key: string): Promise<string> {
        const data = await kv.get(key) as string
        return Promise.resolve(data)
    }

    store(key: string, value: string): void {
        kv.set(key, value, { ex: Number(process.env.CACHE_EXPIRE_TIME) })
    }

    async delete(key: string): Promise<boolean> {
        return Promise.resolve(await kv.del(key) == 1)
    }
}