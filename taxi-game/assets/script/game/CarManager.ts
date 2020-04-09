import { _decorator, Component, Node } from "cc";
import { Car } from "./Car";
const { ccclass, property } = _decorator;

@ccclass("CarManager")
export class CarManager extends Component {
    @property({
        type: Car
    })
    mainCar: Car = null;

    public resetCars(points: Node[]){
        if(points.length <=0){
            console.warn('There is no points in this map');
            return;
        }

        this._createMainCar(points[0]);
    }

    public controlMoving(isRunning = true){
        if (isRunning) {
            this.mainCar.startRunning();
        } else {
            this.mainCar.stopRunning();
        }
    }

    private _createMainCar(point: Node){
        this.mainCar.setEntry(point);
    }
}
