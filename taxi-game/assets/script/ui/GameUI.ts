import { _decorator, Component, Node, LabelComponent, SpriteComponent, SpriteFrame, loader, AnimationComponent } from "cc";
import { RunTimeData } from "../data/GameData";
import { CustomEventListener } from "../data/CustomEventListener";
import { Constants } from "../data/Constants";
const { ccclass, property } = _decorator;

@ccclass("GameUI")
export class GameUI extends Component {
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
        type: SpriteComponent,
        displayOrder: 11,
    })
    avatar: SpriteComponent = null;

    @property({
        type: LabelComponent,
        displayOrder: 12,
    })
    content: LabelComponent = null;

    @property({
        type: Node,
        displayOrder: 13,
    })
    talkNode: Node = null;

    @property({
        type: Node,
        displayOrder: 13,
    })
    guideNode: Node = null;

    private _runtimeData: RunTimeData = null;

    public show(){
        CustomEventListener.on(Constants.EventName.GREETING, this._greeting, this);
        CustomEventListener.on(Constants.EventName.GOODBYE, this._taking, this);
        CustomEventListener.on(Constants.EventName.SHOW_TALK, this._talking, this);
        CustomEventListener.on(Constants.EventName.SHOW_GUIDE, this._showGuide, this);

        this._runtimeData = RunTimeData.instance();
        this._refreshUI();
        this._showGuide(true);
    }

    public hide(){
        CustomEventListener.off(Constants.EventName.GREETING, this._greeting, this);
        CustomEventListener.off(Constants.EventName.GOODBYE, this._taking, this);
        CustomEventListener.off(Constants.EventName.SHOW_TALK, this._talking, this);
        CustomEventListener.off(Constants.EventName.SHOW_GUIDE, this._showGuide, this);
    }

    private _greeting(){
        this.progress[this._runtimeData.maxProgress - 1 - this._runtimeData.currProgress].spriteFrame = this.progress2;
    }

    private _taking(){
        this.progress[this._runtimeData.maxProgress - this._runtimeData.currProgress].spriteFrame = this.progress1;
        if(this._runtimeData.maxProgress === this._runtimeData.currProgress){
            this.targetSp.spriteFrame = this.levelFinished;
        }
    }

    private _talking(customerID: string){
        const table = Constants.talkTable;
        const index = Math.floor(Math.random() * table.length);
        const str = table[index];
        this.content.string = str;
        this.talkNode.active = true;
        const path = `texture/head/head${customerID + 1}/spriteFrame`;
        loader.loadRes(path, SpriteFrame, (err: any, sp: SpriteFrame)=>{
            if(err){
                return;
            }

            if(this.talkNode.active){
                this.avatar.spriteFrame = sp;
            }
        });

        this.scheduleOnce(()=>{
            this.talkNode.active = false;
        }, 3);
    }

    private _showGuide(isShow: boolean){
        this.guideNode.active = isShow;

        if(isShow){
            const animComp = this.guideNode.getComponent(AnimationComponent);
            animComp.play('showGuide');
        }
    }

    private _refreshUI(){
        for (let i = 0; i < this.progress.length; i++) {
            const progress = this.progress[i];
            if (i >= this._runtimeData.maxProgress) {
                progress.node.active = false;
            } else {
                progress.node.active = true;
                progress.spriteFrame = this.progress3;
            }
        }

        const level = this._runtimeData.currLevel;
        this.srcLevel.string = `${level}`;
        this.targetLevel.string = `${level + 1}`;
        this.srcSp.spriteFrame = this.levelFinished;
        this.targetSp.spriteFrame = this.levelUnFinished;
    }
}
