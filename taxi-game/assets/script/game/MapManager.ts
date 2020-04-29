import { _decorator, Component, Node } from "cc";
import { GameMap } from "./GameMap";
const { ccclass, property } = _decorator;

@ccclass("MapManager")
export class MapManager extends Component {
    public currPath: Node[] = [];
    public maxProgress = 0;

    private _currMap: Node = null;

    public resetMap(){
        this._currMap = this.node.children[0];
        const currMap = this._currMap.getComponent(GameMap);
        this.currPath = currMap.path;
        this.maxProgress = currMap.maxProgress;
    }

    public recycle(){
        if(this._currMap){
            this._currMap.destroy();
            this._currMap = null;
        }
    }
}
