import { _decorator, Component, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("GameMap")
export class GameMap extends Component {
    @property({
        type: [Node]
    })
    path: Node[] = [];
}
