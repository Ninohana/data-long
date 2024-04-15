export interface Expirable {
    isExpire(): boolean
}

export default interface Cache<T> {
    getData(): T
}

export abstract class ExpirableCache<T> implements Cache<T>, Expirable {
    time: number = new Date().getTime()

    constructor(time?: number) {
        this.time = time ? this.time + time : -1
    }

    isExpire(): boolean {
        return new Date().getTime() - this.time > 0
    }

    abstract getData(): T
}