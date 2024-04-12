import fs from 'fs'
import { v4 as uuid } from "uuid"

export interface Expirable {
    isExpire(): boolean
}

export default interface Cache<T> extends Expirable {
    getData(): T
}

export class ResponseDataCache implements Cache<string> {
    path: string
    time = new Date().getTime()

    constructor(data: string, time?: number) {
        this.path = `./response_cache/${uuid()}`
        try {
            fs.mkdirSync("./response_cache/")
        } catch (error) {
            ;
        }
        fs.writeFileSync(this.path, data)

        this.time = time ? this.time + time : -1
    }

    getData(): string {
        return fs.readFileSync(this.path).toString()
    }

    isExpire(): boolean {
        return new Date().getTime() - this.time > 0
    }
}