import request from "../../../request"
import { Champion } from "../../Champion";
import Provider from "../Provider";

class ChampionProvider implements Provider<Champion> {
    support(type: string): boolean {
        return type == "hero"
    }

    async supply(id: string): Promise<Champion> {
        try {
            const res = await request.get('https://game.gtimg.cn/images/lol/act/img/js/heroList/hero_list.js')
            for (const hero of res.data["hero"]) {
                if (id == hero["heroId"]) {
                    return Promise.resolve(new Champion(hero["heroId"], hero["name"], hero["alias"]))
                }
            }
            throw new Error("not found")
        } catch (error) {
            return Promise.reject(error)
        }
    }
}

export default new ChampionProvider()