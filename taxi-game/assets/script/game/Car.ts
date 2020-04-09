import { _decorator, Component, Node, Vec3 } from "cc";
import { RoadPoint } from "./RoadPoint";
const { ccclass, property } = _decorator;

const _tempVec = new Vec3();

@ccclass("Car")
export class Car extends Component {
    @property
    maxSpeed = 0.2;

    private _currRoadPoint: RoadPoint = null;
    private _pointA = new Vec3();
    private _pointB = new Vec3();
    private _currSpeed = 0;
    private _isMoving = false;
    private _offset = new Vec3();
    private _originRotation = 0;
    private _targetRotation = 0;
    private _centerPoint = new Vec3();
    private _rotMeasure = 0;
    private _acceleration = 0.2;

    public update(dt: number){
        if (this._isMoving) {
            this._offset.set(this.node.worldPosition);

            this._currSpeed += this._acceleration * dt;
            if(this._currSpeed > this.maxSpeed){
                this._currSpeed = this.maxSpeed;
            }

            if(this._currSpeed <= 0.001){
                this._isMoving = false;
            }

            switch (this._currRoadPoint.moveType) {
                case RoadPoint.RoadMoveType.BEND:
                    const offsetRotation = this._targetRotation - this._originRotation;
                    const currRotation = this._conversion(this.node.eulerAngles.y);
                    let nextStation = (currRotation - this._originRotation) + (this._currSpeed * this._rotMeasure * (this._targetRotation > this._originRotation ? 1 : -1));
                    if(Math.abs(nextStation) > Math.abs(offsetRotation)){
                        nextStation = offsetRotation;
                    }

                    const target = nextStation + this._originRotation;
                    _tempVec.set(0, target, 0);
                    this.node.eulerAngles = _tempVec;
                    Vec3.rotateY(this._offset, this._pointA, this._centerPoint, nextStation * Math.PI / 180);
                    break;
                default:
                    const z = this._pointB.z - this._pointA.z;
                    if (z !== 0) {
                        if (z > 0) {
                            this._offset.z += this._currSpeed;
                            if (this._offset.z > this._pointB.z) {
                                this._offset.z = this._pointB.z;
                            }
                        } else {
                            this._offset.z -= this._currSpeed;
                            if (this._offset.z < this._pointB.z) {
                                this._offset.z = this._pointB.z;
                            }
                        }
                    } else {
                        const x = this._pointB.x - this._pointA.x;
                        if (x > 0) {
                            this._offset.x += this._currSpeed;
                            if (this._offset.x > this._pointB.x) {
                                this._offset.x = this._pointB.x;
                            }
                        } else {
                            this._offset.x -= this._currSpeed;
                            if (this._offset.x < this._pointB.x) {
                                this._offset.x = this._pointB.x;
                            }
                        }
                    }
                    break;
            }

            this.node.setWorldPosition(this._offset);
            Vec3.subtract(_tempVec, this._pointB, this._offset);
            if (_tempVec.length() <= 0.01){
                this._arrivalStation();
            }
        }
    }

    public setEntry(entry: Node){
        this.node.setWorldPosition(entry.worldPosition);
        this._currRoadPoint = entry.getComponent(RoadPoint);
        if(!this._currRoadPoint){
            console.warn('There is no RoadPoint in ' + entry.name);
            return;
        }

        this._pointA.set(entry.worldPosition);
        this._pointB.set(this._currRoadPoint.nextStation.worldPosition);

        const z = this._pointB.z - this._pointA.z;
        if (z !== 0) {
            if (z < 0) {
                this.node.eulerAngles = new Vec3();
            } else {
                this.node.eulerAngles = new Vec3(0, 180, 0);
            }
        } else {
            const x = this._pointB.x - this._pointA.x;
            if (x > 0) {
                this.node.eulerAngles = new Vec3(0, 270, 0);
            } else {
                this.node.eulerAngles = new Vec3(0, 90, 0);
            }
        }
    }

    public startRunning() {
        if (this._currRoadPoint) {
            this._isMoving = true;
            this._currSpeed = 0;
            this._acceleration = 0.2;
        }
    }

    public stopRunning() {
        this._acceleration = -0.3;
        // this._isMoving = false;
    }

    private _arrivalStation(){
        console.log('arrival...............');
        this._pointA.set(this._pointB);
        this._currRoadPoint = this._currRoadPoint.nextStation.getComponent(RoadPoint);
        if (this._currRoadPoint.nextStation) {
            this._pointB.set(this._currRoadPoint.nextStation.worldPosition);

            if(this._currRoadPoint.moveType === RoadPoint.RoadMoveType.BEND){
                if (this._currRoadPoint.clockwise) {
                    this._originRotation = this._conversion(this.node.eulerAngles.y);
                    this._targetRotation = this._originRotation - 90;

                    if ((this._pointB.z < this._pointA.z && this._pointB.x > this._pointA.x) ||
                        (this._pointB.z > this._pointA.z && this._pointB.x < this._pointA.x)) {
                        this._centerPoint.set(this._pointB.x, 0, this._pointA.z);
                    } else {
                        this._centerPoint.set(this._pointA.x, 0, this._pointB.z);
                    }
                } else {
                    this._originRotation = this._conversion(this.node.eulerAngles.y);
                    this._targetRotation = this._originRotation + 90;

                    if ((this._pointB.z > this._pointA.z && this._pointB.x > this._pointA.x) ||
                        (this._pointB.z < this._pointA.z && this._pointB.x < this._pointA.x)) {
                        this._centerPoint.set(this._pointB.x, 0, this._pointA.z);
                    } else {
                        this._centerPoint.set(this._pointA.x, 0, this._pointB.z);
                    }
                }

                Vec3.subtract(_tempVec, this._pointA, this._centerPoint);
                const r = _tempVec.length();
                this._rotMeasure = 90 / (Math.PI * r / 2);

            }
        } else {
            this._isMoving = false;
            this._currRoadPoint = null;
        }
    }

    private _conversion(value: number) {
        let a = value;
        if (a <= 0) {
            a += 360;
        }

        return a;
    }
}
