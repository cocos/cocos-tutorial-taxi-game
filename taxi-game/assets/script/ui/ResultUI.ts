import { _decorator, Component, Node, SpriteFrame, LabelComponent, SpriteComponent } from "cc";
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
        type: [Node],
        displayOrder: 7,
    })
    progress: Node[] = [];

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

    }

    public hide(){

    }

    public clickBtnNormal(){

    }
}
