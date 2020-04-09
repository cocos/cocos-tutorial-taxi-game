
import { _decorator, Component, Node, Vec3, Enum, macro } from "cc";
const { ccclass, property } = _decorator;

enum ROAD_POINT_TYPE {
    NORMAL = 1,
    START,
    GREETING,
    GOODBYE,
    END,
    AI_START,
}

Enum(ROAD_POINT_TYPE);

enum ROAD_MOVE_TYPE {
    LINE = 1,
    BEND,
}

Enum(ROAD_MOVE_TYPE);

@ccclass("RoadPoint")
export class RoadPoint extends Component {
    public static RoadPointType = ROAD_POINT_TYPE;
    public static RoadMoveType = ROAD_MOVE_TYPE;

    @property({
        type: ROAD_POINT_TYPE,
        displayOrder: 1,
    })
    type = ROAD_POINT_TYPE.NORMAL;

    @property({
        type: Node,
        displayOrder: 2,
    })
    nextStation: Node = null;

    @property({ type: ROAD_MOVE_TYPE, displayOrder: 3})
    moveType = ROAD_MOVE_TYPE.LINE;

    @property({displayOrder: 4, visible:  function (this: RoadPoint){
        return this.moveType === ROAD_MOVE_TYPE.BEND;
    }})
    clockwise: boolean = false;

    @property({
        visible: function (this: RoadPoint) {
            return this.type === ROAD_POINT_TYPE.GREETING || this.type === ROAD_POINT_TYPE.GOODBYE;
        }
    })
    direction = new Vec3();

    @property({ displayOrder: 5, visible:  function (this: RoadPoint){
        return this.type === ROAD_POINT_TYPE.AI_START;
    }})
    delayTime = 0;

    @property({ displayOrder: 6, visible:  function (this: RoadPoint){
        return this.type === ROAD_POINT_TYPE.AI_START;
    }})
    interval = 3;

    @property({displayOrder: 7, visible:  function (this: RoadPoint){
        return this.type === ROAD_POINT_TYPE.AI_START;
    }})
    speed = 0.05;

    @property({ displayOrder: 8, visible:  function (this: RoadPoint){
        return this.type === ROAD_POINT_TYPE.AI_START;
    }})
    cars = '201';

    private _arrCars: string[] = [];
    private _cd: Function = null;

    public start(){
        this._arrCars = this.cars.split(',');
    }

    public startSchedule(cd: Function){
        if(this.type !== ROAD_POINT_TYPE.AI_START){
            return;
        }

        this.stopSchedule();
        this._cd = cd;
        this.scheduleOnce(this._startDelay, this.delayTime);
    }

    public stopSchedule(){
        this.unschedule(this._startDelay);
        this.unschedule(this._scheduleCD);
    }

    private _startDelay(){
        this._scheduleCD();
        this.schedule(this._scheduleCD, this.interval, macro.REPEAT_FOREVER);
    }

    private _scheduleCD(){
        const index = Math.floor(Math.random() * this._arrCars.length);
        if(this._cd){
            this._cd(this, this._arrCars[index]);
        }
    }
}
