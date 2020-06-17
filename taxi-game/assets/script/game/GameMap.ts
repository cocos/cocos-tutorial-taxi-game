import { _decorator, Component, Node, JsonAsset } from "cc";
import { RoadPoint } from "./RoadPoint";
const { ccclass, property } = _decorator;

@ccclass("GameMap")
export class GameMap extends Component {
    @property({
        type: [Node]
    })
    path: Node[] = [];

    @property
    public maxProgress = 2;
}
