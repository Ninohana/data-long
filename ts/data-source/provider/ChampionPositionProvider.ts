import request from "../../../request"
import GameElement from "../../game/GameElement";
import Provider from "../Provider";
import vm from 'vm'

class Position implements GameElement {
    lane: string[]
    constructor(lane: string[]) {
        this.lane = lane
    }
}

class ChampionPositionProvider implements Provider<Position> {
    support(type: string): boolean {
        return type == "lane"
    }

    async supply(id: string): Promise<Position> {
        try {
            const res = await request.get('https://lol.qq.com/act/lbp/common/guides/guideschampion_position.js')
            var ctx = vm.createContext({})
            vm.runInContext(res.data, ctx)
            return Promise.resolve(new Position(Object.keys(ctx.CHAMPION_POSITION["list"][id])))
        } catch (error) {
            return Promise.reject(error)
        }
    }
}

export default new ChampionPositionProvider()