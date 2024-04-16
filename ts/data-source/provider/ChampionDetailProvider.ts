import request from "../../../request"
import GameElement from "../../game/GameElement";
import Provider from "../Provider";
import vm from 'vm'

class ChampionDetail implements GameElement {
    championLane: string
    championTrend: string
    championFight: string
    gameVer: string
    date: string
    constructor(championLane: string, championTrend: string, championFight: string, gameVer: string, date: string) {
        this.championLane = championLane
        this.championTrend = championTrend
        this.championFight = championFight
        this.gameVer = gameVer
        this.date = date
    }
}

class ChampionDetailProvider implements Provider<ChampionDetail> {
    support(type: string): boolean {
        return ["perk", "item", "skill"].includes(type)
    }

    async supply(id: string): Promise<ChampionDetail> {
        try {
            const res = await request.get(`https://lol.qq.com/act/lbp/common/guides/champDetail/champDetail_${id}.js`)
            var ctx = vm.createContext({})
            vm.runInContext(res.data, ctx)
            const CHAMPION_DETAIL = ctx[`CHAMPION_DETAIL_${id}`]
            return Promise.resolve(new ChampionDetail(CHAMPION_DETAIL["list"]["championLane"], CHAMPION_DETAIL["list"]["championTrend"], CHAMPION_DETAIL["list"]["championFight"], CHAMPION_DETAIL["gameVer"], CHAMPION_DETAIL["date"]))
        } catch (error) {
            return Promise.reject(error)
        }
    }
}

export default new ChampionDetailProvider()