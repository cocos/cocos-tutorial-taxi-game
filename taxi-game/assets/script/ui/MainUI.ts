import { _decorator, Component, Node } from "cc";
import { CustomEventListener } from "../data/CustomEventListener";
import { Constants } from "../data/Constants";
const { ccclass, property } = _decorator;

@ccclass("MainUI")
export class MainUI extends Component {
    public clickStart(){
        CustomEventListener.dispatchEvent(Constants.EventName.GAME_START);
    }
}
