import { _decorator, Component, Node, Touch, EventTouch, BoxColliderComponent, Vec3 } from "cc";
import { MapManager } from "./MapManager";
import { CarManager } from "./CarManager";
import { AudioManager } from "./AudioManager";
import { Constants } from "../data/Constants";
import { CustomEventListener } from "../data/CustomEventListener";
import { UIManager } from "../ui/UIManager";
import { RunTimeData } from "../data/GameData";
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
        this._reset();
        const collider = this.group.getComponent(BoxColliderComponent);
        collider.setGroup(Constants.CarGroup.NORMAL);
        collider.setMask(-1);
    }

    public start(){
        UIManager.showDialog(Constants.UIPage.mainUI);
        this.node.on(Node.EventType.TOUCH_START, this._touchStart, this);
        this.node.on(Node.EventType.TOUCH_END, this._touchEnd, this);
        CustomEventListener.on(Constants.EventName.GAME_START, this._gameStart, this);
        CustomEventListener.on(Constants.EventName.GAME_OVER, this._gameOver, this);
        CustomEventListener.on(Constants.EventName.NEW_LEVEL, this._newLevel, this);

        AudioManager.playMusic(Constants.AudioSource.BACKGROUND);
    }

    private _touchStart(touch: Touch, event: EventTouch) {
        this.carManager.controlMoving();
    }

    private _touchEnd(touch: Touch, event: EventTouch) {
        this.carManager.controlMoving(false);
    }

    private _gameStart(){
        UIManager.hideDialog(Constants.UIPage.mainUI);
        UIManager.showDialog(Constants.UIPage.gameUI);
    }

    private _gameOver(){
        UIManager.hideDialog(Constants.UIPage.gameUI);
        UIManager.showDialog(Constants.UIPage.resultUI);
    }

    private _newLevel(){
        UIManager.hideDialog(Constants.UIPage.resultUI);
        UIManager.showDialog(Constants.UIPage.mainUI);

        this._reset();
    }

    private _reset(){
        this.mapManager.resetMap();
        this.carManager.reset(this.mapManager.currPath);
        const runtimeData = RunTimeData.instance();
        runtimeData.currProgress = 0;
        runtimeData.maxProgress = this.mapManager.maxProgress;
    }
}
