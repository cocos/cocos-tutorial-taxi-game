import { _decorator, Component, Node, SpriteFrame, Label, Sprite } from "cc";
import { RunTimeData, PlayerData } from "../data/GameData";
import { CustomEventListener } from "../data/CustomEventListener";
import { Constants } from "../data/Constants";
const { ccclass, property } = _decorator;

@ccclass("ResultUI")
export class ResultUI extends Component {
    @property({
        type: Label,
        displayOrder: 1,
    })
    public targetLevel: Label = null!;

    @property({
        type: Label,
        displayOrder: 2,
    })
    public srcLevel: Label = null!;

    @property({
        type: Sprite,
        displayOrder: 3,
    })
    public targetSp: Sprite = null!;

    @property({
        type: Sprite,
        displayOrder: 4,
    })
    public srcSp: Sprite = null!;

    @property({
        type: SpriteFrame,
        displayOrder: 5,
    })
    public levelFinished: SpriteFrame = null!;

    @property({
        type: SpriteFrame,
        displayOrder: 6,
    })
    public levelUnFinished: SpriteFrame = null!;

    @property({
        type: [Sprite],
        displayOrder: 7,
    })
    public progress: Sprite[] = [];

    @property({
        type: SpriteFrame,
        displayOrder: 8,
    })
    public progress1: SpriteFrame = null!;

    @property({
        type: SpriteFrame,
        displayOrder: 9,
    })
    public progress2: SpriteFrame = null!;

    @property({
        type: SpriteFrame,
        displayOrder: 10,
    })
    public progress3: SpriteFrame = null!;

    @property({
        type: Label,
        displayOrder: 11,
    })
    public progressLabel: Label = null!;

    @property({
        type: Label,
        displayOrder: 12,
    })
    public moneyLabel: Label = null!;

    public show(){
        const runtimeData = RunTimeData.instance();
        const maxProgress = runtimeData.maxProgress;
        const currProgress = runtimeData.currProgress;
        let index = 0;
        for (let i = 0; i < this.progress.length; i++) {
            const progress = this.progress[i];
            if (i >= maxProgress) {
                progress.node.active = false;
            } else {
                progress.node.active = true;
                index = maxProgress - 1 - i;
                if (index >= currProgress) {
                    progress.spriteFrame = (index === currProgress && !runtimeData.isTakeOver) ? this.progress2 : this.progress3;
                } else {
                    progress.spriteFrame = this.progress1;
                }
            }
        }

        this.srcSp.spriteFrame = this.levelFinished;
        this.targetSp.spriteFrame = currProgress === maxProgress ? this.levelFinished : this.levelUnFinished;
        this.progressLabel.string = `你完成了${currProgress}个订单`;
        const level = runtimeData.currLevel;
        this.srcLevel.string = `${level}`;
        this.targetLevel.string = `${level + 1}`;
        this.moneyLabel.string = `${runtimeData.money}`;
    }

    public clickBtnNormal(){
        const runtimeData = RunTimeData.instance();
        if (runtimeData.currProgress === runtimeData.maxProgress){
            PlayerData.instance().passLevel(RunTimeData.instance().money);
        }

        CustomEventListener.dispatchEvent(Constants.EventName.NEW_LEVEL);
    }
}
