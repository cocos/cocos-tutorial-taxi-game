import { _decorator, Component, Node, Label, Sprite, SpriteFrame, loader, Animation } from "cc";
import { RunTimeData } from "../data/GameData";
import { CustomEventListener } from "../data/CustomEventListener";
import { Constants } from "../data/Constants";
const { ccclass, property } = _decorator;

@ccclass("GameUI")
export class GameUI extends Component {
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
    progress2: SpriteFrame = null!;

    @property({
        type: SpriteFrame,
        displayOrder: 10,
    })
    public progress3: SpriteFrame = null!;

    @property({
        type: Sprite,
        displayOrder: 11,
    })
    public avatar: Sprite = null!;

    @property({
        type: Label,
        displayOrder: 12,
    })
    public content: Label = null!;

    @property({
        type: Node,
        displayOrder: 13,
    })
    public talkNode: Node = null!;

    @property({
        type: Node,
        displayOrder: 13,
    })
    public guideNode: Node = null!;

    private _runtimeData: RunTimeData = null!;

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
        loader.loadRes(path, SpriteFrame, (err, sp)=>{
            if(err){
                return;
            }

            if(this.talkNode.active){
                this.avatar.spriteFrame = sp!;
            }
        });

        this.scheduleOnce(()=>{
            this.talkNode.active = false;
        }, 3);
    }

    private _showGuide(isShow: boolean){
        this.guideNode.active = isShow;

        if(isShow){
            const animComp = this.guideNode.getComponent(Animation)!;
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
