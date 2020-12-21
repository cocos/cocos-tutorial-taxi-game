import { _decorator, Component, Node, Label } from "cc";
const { ccclass, property } = _decorator;

@ccclass("UpdateLabelValue")
export class UpdateLabelValue extends Label {
    private _startVal = 0;
    private _endVal = 0;
    private _diffVal = 0;
    private _currTime = 0;
    private _changeTime = 0;
    private _isPlaying = false;

    public playUpdateValue(start: number, end: number, changeTime: number){
        this._startVal = start;
        this._endVal = end;
        this._diffVal = this._endVal - this. _startVal;
        this._currTime = 0;
        this._changeTime = changeTime;

        if (changeTime === 0) {
            this.string = `${this._endVal}`;
            return;
        }

        this.string = `${this._startVal}`;
        this._isPlaying = true;
    }

    public update(dt){
        if(!this._isPlaying){
            return;
        }

        if(this._currTime < this._changeTime){
            this._currTime += dt;
            const targetVal = this._startVal + Math.floor((this._currTime / this._changeTime) * this._diffVal);
            this.string = `${targetVal}`;
            return;
        }

        this.string = `${this._endVal}`;
        this._isPlaying = false;
    }
}
