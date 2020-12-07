import { _decorator, Component, Node, Label, sys } from "cc";
import { CustomEventListener } from "../data/CustomEventListener";
import { Constants } from "../data/Constants";
import { PlayerData, RunTimeData } from "../data/GameData";
const { ccclass, property } = _decorator;

@ccclass("MainUI")
export class MainUI extends Component {
    @property({
        type: Label
    })
    public  moneyLabel: Label = null!;

    @property({
        type: Node
    })
    debugNode: Node = null;

    @property({
        type: LabelComponent
    })
    debugLabel: LabelComponent = null;

    public onEnable(){
        this.moneyLabel.string = `${RunTimeData.instance().totalMoney}`;
    }

    public clickStart(){
        CustomEventListener.dispatchEvent(Constants.EventName.GAME_START);
    }

    public clickDebug(){
        this.debugNode.active = !this.debugNode.active;
    }

    public addLevel(){
        this.debugLabel.string = 'level increase success!';
        PlayerData.instance().passLevel(0);
    }

    public reduceLevel() {
        this.debugLabel.string = 'level reduction success!';
        const level = PlayerData.instance().playerInfo.level;
        if (level - 2 > 0) {
            PlayerData.instance().playerInfo.level = level - 2;
        } else {
            PlayerData.instance().playerInfo.level = 0;
        }

        this._time = time;
        if (this._clickTime >= 2) {
            sys.localStorage.removeItem(Constants.GameConfigID);
            this._clickTime = 0;
            console.log('clear cache');
        }
    }
}
