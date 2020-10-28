import { _decorator, Component, Node, Touch, EventTouch, BoxColliderComponent, Vec3, loader, Prefab, instantiate, JsonAsset } from "cc";
import { MapManager } from "./MapManager";
import { CarManager } from "./CarManager";
import { AudioManager } from "./AudioManager";
import { Constants } from "../data/Constants";
import { CustomEventListener } from "../data/CustomEventListener";
import { UIManager } from "../ui/UIManager";
import { RunTimeData, PlayerData } from "../data/GameData";
import { LoadingUI } from "../ui/LoadingUI";
import { Configuration } from "../data/Configuration";
import { ResUtil } from "../data/ResUtil";
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

    @property({
        type: LoadingUI
    })
    loadingUI: LoadingUI = null;

    // private _progress = 5;
    private _runtimeData: RunTimeData = null;
    private _lastMapID = 0;

    public onLoad(){
        this._runtimeData = RunTimeData.instance();
        Configuration.instance().init();
        PlayerData.instance().loadFromCache();
        this.loadingUI.show();
        this._lastMapID = this._runtimeData.currLevel;
        this._loadMap(this._lastMapID);
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
        if (this._lastMapID === this._runtimeData.currLevel) {
            this._reset();
            return;
        }

        this.mapManager.recycle();
        this.loadingUI.show();
        this._lastMapID = this._runtimeData.currLevel;
        this._loadMap(this._lastMapID);
    }

    private _reset(){
        // this.mapManager.resetMap();
        this.carManager.reset(this.mapManager.currPath);
        const runtimeData = this._runtimeData;
        runtimeData.currProgress = 0;
        runtimeData.maxProgress = this.mapManager.maxProgress;
        runtimeData.money = 0;
    }

    private _loadMap(level: number, cb?: Function){
        ResUtil.getMap(level, (err: any, asset: JsonAsset)=>{
            if(err){
                console.warn(err);
                return;
            }

            CustomEventListener.dispatchEvent(Constants.EventName.UPDATE_PROGRESS, 30, 'Start building a city...');
            this.mapManager.buildMap(asset, () => {
                CustomEventListener.dispatchEvent(Constants.EventName.UPDATE_PROGRESS, 20, 'End building a city...');
                if (cb) {
                    cb();
                }

                this._reset();
                this.loadingUI.finishLoading();
            });
        });
        // let map = 'map/map';
        // if (level >= 100) {
        //     map += `${level}`;
        // } else if (level >= 10) {
        //     map += `1${level}`;
        // } else {
        //     map += `10${level}`;
        // }

        // this._progress = 5;
        // this.scheduleOnce(this._loadingSchedule, 0.2);
        // loader.loadRes(map, Prefab, (err: any, prefab: Prefab) =>{
        //     if(err){
        //         console.warn(err);
        //         return;
        //     }

        //     const mapNode = instantiate(prefab) as Node;
        //     mapNode.parent = this.mapManager.node;
        //     if(cb){
        //         cb();
        //     }

        //     this._progress = 0;
        //     this._reset();
        //     this.loadingUI.finishLoading();
        // })
    }

    // private _loadingSchedule(){
    //     if(this._progress <= 0){
    //         return;
    //     }

    //     this._progress --;
    //     CustomEventListener.dispatchEvent(Constants.EventName.UPDATE_PROGRESS, 40 / 5);
    //     this.scheduleOnce(this._loadingSchedule, 0.2)
    // }
}
