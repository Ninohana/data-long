export interface Expirable {
    isExpire(): boolean
}

export default interface Cache<T> extends Expirable {
    getData(): T
}

export class ResponseDataCache implements Cache<string> {
    data: string
    time = new Date().getTime()

    constructor(data: string, time?: number) {
        this.data = data
        this.time = time ? this.time + time : -1
    }

    getData(): string {
        return this.data
    }

    isExpire(): boolean {
        return new Date().getTime() - this.time > 0
    }
}