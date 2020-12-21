import { _decorator, Component, Node, Prefab, ParticleUtils, ParticleSystem, instantiate } from "cc";
import { CustomEventListener } from "../data/CustomEventListener";
import { Constants } from "../data/Constants";
import { PoolManager } from "../data/PoolManager";
const { ccclass, property } = _decorator;

@ccclass("EffectManager")
export class EffectManager extends Component {
    @property({
        type: Prefab
    })
    public brakeTrail: Prefab = null!;

    @property({
        type: Prefab
    })
    public coin: Prefab = null!;

    private _followTarget: Node | null = null;
    private _currBraking: Node | null = null;
    private _coin: ParticleSystem | null = null;

    public start() {
        CustomEventListener.on(Constants.EventName.START_BRAKING, this._startBraking, this);
        CustomEventListener.on(Constants.EventName.END_BRAKING, this._endBraking, this);
        CustomEventListener.on(Constants.EventName.SHOW_COIN, this._showCoin, this);
    }

    public update() {
        if (this._currBraking && this._followTarget) {
            this._currBraking.setWorldPosition(this._followTarget.worldPosition);
        }
    }

    private _startBraking(...args:any[]) {
        const follow = this._followTarget = args[0];
        this._currBraking = PoolManager.getNode(this.brakeTrail, this.node);
        this._currBraking.setWorldPosition(follow);
        ParticleUtils.play(this._currBraking);
    }

    private _endBraking() {
        const currBraking = this._currBraking!;
        ParticleUtils.stop(currBraking);
        this.scheduleOnce(() => {
            PoolManager.setNode(currBraking);
        }, 2);

        this._currBraking = null;
        this._followTarget = null;
    }

    private _showCoin(...args: any[]) {
        const pos = args[0];
        if(!this._coin){
            const coin = instantiate(this.coin) as Node;
            coin.setParent(this.node);
            this._coin = coin.getComponent(ParticleSystem);
        }

        this._coin!.node.setWorldPosition(pos);
        this._coin!.play();
    }
}
