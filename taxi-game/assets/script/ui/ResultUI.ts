import { _decorator, Component, Node, SpriteFrame, LabelComponent, SpriteComponent } from "cc";
import { RunTimeData } from "../data/GameData";
import { CustomEventListener } from "../data/CustomEventListener";
import { Constants } from "../data/Constants";
const { ccclass, property } = _decorator;

@ccclass("ResultUI")
export class ResultUI extends Component {
    @property({
        type: LabelComponent,
        displayOrder: 1,
    })
    targetLevel: LabelComponent = null;

    @property({
        type: LabelComponent,
        displayOrder: 2,
    })
    srcLevel: LabelComponent = null;

    @property({
        type: SpriteComponent,
        displayOrder: 3,
    })
    targetSp: SpriteComponent = null;

    @property({
        type: SpriteComponent,
        displayOrder: 4,
    })
    srcSp: SpriteComponent = null;

    @property({
        type: SpriteFrame,
        displayOrder: 5,
    })
    levelFinished: SpriteFrame = null;

    @property({
        type: SpriteFrame,
        displayOrder: 6,
    })
    levelUnFinished: SpriteFrame = null;

    @property({
        type: [SpriteComponent],
        displayOrder: 7,
    })
    progress: SpriteComponent[] = [];

    @property({
        type: SpriteFrame,
        displayOrder: 8,
    })
    progress1: SpriteFrame = null;

    @property({
        type: SpriteFrame,
        displayOrder: 9,
    })
    progress2: SpriteFrame = null;

    @property({
        type: SpriteFrame,
        displayOrder: 10,
    })
    progress3: SpriteFrame = null;

    @property({
        type: LabelComponent,
        displayOrder: 11,
    })
    progressLabel: LabelComponent = null;

    @property({
        type: LabelComponent,
        displayOrder: 12,
    })
    moneyLabel: LabelComponent = null;

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
    }

    public clickBtnNormal(){
        CustomEventListener.dispatchEvent(Constants.EventName.NEW_LEVEL);
    }
}
