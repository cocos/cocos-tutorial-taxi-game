import { _decorator, Component, Node, Touch, EventTouch, BoxColliderComponent, Vec3 } from "cc";
import { MapManager } from "./MapManager";
import { CarManager } from "./CarManager";
import { AudioManager } from "./AudioManager";
import { Constants } from "../data/Constants";
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

    @property({
        type: Node,
    })
    group: Node = null;

    public onLoad(){
        this.mapManager.resetMap();
        this.carManager.reset(this.mapManager.currPath);
        const collider = this.group.getComponent(BoxColliderComponent);
        collider.setGroup(Constants.CarGroup.NORMAL);
        collider.setMask(-1);
    }

    public start(){
        this.node.on(Node.EventType.TOUCH_START, this._touchStart, this);
        this.node.on(Node.EventType.TOUCH_END, this._touchEnd, this);

        AudioManager.playMusic(Constants.AudioSource.BACKGROUND);
    }

    private _touchStart(touch: Touch, event: EventTouch) {
        this.carManager.controlMoving();
    }

    private _touchEnd(touch: Touch, event: EventTouch) {
        this.carManager.controlMoving(false);
    }
}
