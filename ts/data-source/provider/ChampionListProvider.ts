import request from "../../../request"
import { Champion } from "../../Champion";
import Provider from "../Provider";

class ChampionListProvider implements Provider<Champion[]> {
    support(type: string): boolean {
        return type == "clist"
    }

    async supply(): Promise<Champion[]> {
        try {
            const res = await request.get('https://game.gtimg.cn/images/lol/act/img/js/heroList/hero_list.js')
            const championList = new Array<Champion>
            for (const hero of res.data["hero"]) {
                championList.push(new Champion(hero["heroId"], hero["name"], hero["alias"]))
            }
            return Promise.resolve(championList)
        } catch (error) {
            return Promise.reject(error)
        }
    }
}

export default new ChampionListProvider()