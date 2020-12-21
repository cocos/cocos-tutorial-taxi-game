import { _decorator, Component, Node, Label, sys } from "cc";
import { CustomEventListener } from "../data/CustomEventListener";
import { Constants } from "../data/Constants";
import { RunTimeData } from "../data/GameData";
const { ccclass, property } = _decorator;

@ccclass("MainUI")
export class MainUI extends Component {
    @property({
        type: Label
    })
    public  moneyLabel: Label = null!;

    private _clickTime = 0;
    private _time = 0;

    public onEnable(){
        this.moneyLabel.string = `${RunTimeData.instance().totalMoney}`;
    }

    public clickStart(){
        CustomEventListener.dispatchEvent(Constants.EventName.GAME_START);
    }

    public clickDebug(){
        const time = Date.now();
        if (time - this._time <= 200) {
            this._clickTime++;
        } else {
            this._clickTime = 0;
        }

        this._time = time;
        if (this._clickTime >= 2) {
            sys.localStorage.removeItem(Constants.GameConfigID);
            this._clickTime = 0;
            console.log('clear cache');
        }
    }
}
