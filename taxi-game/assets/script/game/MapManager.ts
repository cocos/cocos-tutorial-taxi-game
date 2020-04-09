import { _decorator, Component, Node } from "cc";
import { GameMap } from "./GameMap";
const { ccclass, property } = _decorator;

@ccclass("MapManager")
export class MapManager extends Component {
    public currPath: Node[] = [];

    public resetMap(){
        const currMap = this.node.children[0].getComponent(GameMap);
        this.currPath = currMap.path;
    }
}
