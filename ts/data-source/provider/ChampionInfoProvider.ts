import request from "../../../request"
import { GameElement } from "../../GameElement";
import Provider from "../Provider";

class ChampionInfo implements GameElement {
    id: string
    name: string
    alias: string
    title: string
    roles: [string]
    shortBio: string
    constructor(id: string, name: string, alias: string, title: string, roles: [string], shortBio: string) {
        this.id = id
        this.name = name
        this.alias = alias
        this.title = title
        this.roles = roles
        this.shortBio = shortBio
    }
}

class ChampionInfoProvider implements Provider<ChampionInfo> {
    support(type: string): boolean {
        return type == "info"
    }

    async supply(id: string): Promise<ChampionInfo> {
        try {
            const res = await request.get(`https://ossweb-img.qq.com/images/lol/act/img/js/hero/${id}.js`)
            const hero = res.data["hero"]
            return Promise.resolve(new ChampionInfo(hero["heroId"], hero["name"], hero["alias"], hero["title"], hero["roles"], hero["shortBio"]))
        } catch (error) {
            return Promise.reject(error)
        }
    }
}

export default new ChampionInfoProvider()