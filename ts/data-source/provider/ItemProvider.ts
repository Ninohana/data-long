import request from "../../../request"
import { GameElement } from "../../GameElement";
import Provider from "../Provider";

class Item implements GameElement {
    id: string
    name: string
    keywords: string
    constructor(id: string, name: string, keywords: string) {
        this.id = id
        this.name = name
        this.keywords = keywords
    }
}

class ItemProvider implements Provider<Item> {
    support(type: string): boolean {
        return type == "item"
    }

    async supply(id: string): Promise<Item> {
        try {
            const res = await request.get('https://ossweb-img.qq.com/images/lol/act/img/js/items/items.js')
            for (let item of res.data["items"]) {
                if (id == item["itemId"]) {
                    return Promise.resolve(new Item(item["itemId"], item["name"], item["keywords"]))
                }
            }
            throw new Error("not found")
        } catch (error) {
            return Promise.reject(error)
        }
    }
}

export default new ItemProvider()