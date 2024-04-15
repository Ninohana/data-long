export interface SyncCacheStorage<T> {
    has(key: string): boolean

    match(key: string): T

    store(key: string, value: T): void

    delete(key: string): boolean
}

export default interface CacheStorage<T> {
    has(key: string): Promise<boolean>

    match(key: string): Promise<T>

    store(key: string, value: T): void

    delete(key: string): Promise<boolean>
}