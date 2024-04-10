import { GameElement } from "./GameElement";

export class Champion implements GameElement{
    id: string;
    name: string;
    alias: string;

    constructor(
        id: string,
        name: string,
        alias: string
    ) {
        this.id = id;
        this.name = name;
        this.alias = alias;
    }
}