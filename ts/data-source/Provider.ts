import GameElement from "../game/GameElement";

export default interface Provider<T extends GameElement> {
    support(type: string): boolean

    supply(...args: any): Promise<T>
}