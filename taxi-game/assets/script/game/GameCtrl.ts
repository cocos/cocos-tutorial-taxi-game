import { _decorator, Component, Node, Touch, EventTouch } from "cc";
import { MapManager } from "./MapManager";
import { CarManager } from "./CarManager";
const { ccclass, property } = _decorator;

@ccclass("GameCtrl")
export class GameCtrl extends Component {
    @property({
        type: MapManager,
    })
    mapManager: MapManager = null;

    @property({
        type: CarManager
    })
    carManager: CarManager = null;

    public onLoad(){
        this.mapManager.resetMap();
        this.carManager.resetCars(this.mapManager.currPath);
    }

    public start(){
        this.node.on(Node.EventType.TOUCH_START, this._touchStart, this);
        this.node.on(Node.EventType.TOUCH_END, this._touchEnd, this);
    }

    private _touchStart(touch: Touch, event: EventTouch) {
        this.carManager.controlMoving();
    }

    private _touchEnd(touch: Touch, event: EventTouch) {
        this.carManager.controlMoving(false);
    }
}
