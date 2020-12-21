import { _decorator, Component, Node, JsonAsset, Prefab, Vec3 } from "cc";
// import { GameMap } from "./GameMap";
import { CustomEventListener } from "../data/CustomEventListener";
import { ResUtil } from "../data/ResUtil";
import { PoolManager } from "../data/PoolManager";
import { RoadPoint } from "./RoadPoint";
const { ccclass, property } = _decorator;

type DicPrefab = { [name: string]: Prefab };

@ccclass("MapManager")
export class MapManager extends Component {
    public currPath: Node[] = [];
    public maxProgress = 0;

    // private _currMap: Node = null;
    private _objMap: any;
    private _completeCb: Function | null = null;
    private _currProgress = 0;
    private _maxProgress = 6;

    public resetMap(){
        // this._currMap = this.node.children[0];
        // const currMap = this._currMap.getComponent(GameMap);
        // this.currPath = currMap.path;
        // this.maxProgress = currMap.maxProgress;
    }

    public recycle(){
        // if(this._currMap){
        //     this._currMap.destroy();
        //     this._currMap = null;
        // }

        this._recycleModel('plane');
        this._recycleModel('road');
        this._recycleModel('tree');
        this._recycleModel('house');
        this._recycleModel('sign');

        this.node.removeAllChildren();
    }

    public buildMap(res: JsonAsset, cb?: Function){
        this._objMap = res;
        this._completeCb = cb || null;
        this._currProgress = 0;
        this._maxProgress = 6;
        this._buildModel('plane');
        this._buildModel('road');
        this._buildModel('tree');
        this._buildModel('house');
        this._buildModel('sign');
        this._buildPath();
    }

    private _buildModel(type: string){
        if (!this._objMap.hasOwnProperty(type)) {
            // go on
            this._triggerFinished(type);
            return;
        }

        // research all resources
        let arrName = [];
        let objPlane = this._objMap[type];
        for (let i = 0; i < objPlane.children.length; i++) {
            let name = objPlane.children[i].name;
            if (arrName.indexOf(name) === -1) {
                arrName.push(name);
            }
        }

        let dictPrefab: DicPrefab = {};
        ResUtil.getMapObjs(type, arrName, undefined, (err: any, arrPrefabs: Prefab[])=>{
            if (err) {
                console.error(err);
                return;
            }

            for (let idx = 0; idx < arrPrefabs.length; idx++) {
                let prefab = arrPrefabs[idx];
                dictPrefab[prefab.data.name] = prefab;
            }

            // create manager node
            let nodeParent = new Node(type);
            nodeParent.parent = this.node;
            nodeParent.setPosition(new Vec3(objPlane.pX, objPlane.pY, objPlane.pZ));
            for (let idx = 0; idx < objPlane.children.length; idx++) {
                let child = objPlane.children[idx];
                let prefab = dictPrefab[child.name];
                let node = PoolManager.getNode(prefab, nodeParent);
                node.setPosition(child.pX, child.pY, child.pZ);
                node.eulerAngles = new Vec3(child.rX, child.rY, child.rZ);
                node.setScale(child.sX, child.sY, child.sZ);
            }

            this._triggerFinished(type);
        });
    }

    private _buildPath(){
        if (!this._objMap.hasOwnProperty('path')) {
            return;
        }

        this.currPath.length = 0;
        this.maxProgress = 0;
        let objPathRoot = this._objMap['path'];
        let nodePathRoot = new Node('path');
        nodePathRoot.parent = this.node;
        nodePathRoot.setPosition(objPathRoot.pX, objPathRoot.pY, objPathRoot.pZ);

        //create path
        for (let idx = 0; idx < objPathRoot.children.length; idx++) {
            let objPath = objPathRoot.children[idx];
            let nodePath = new Node(objPath.name);
            nodePath.parent = nodePathRoot;
            nodePath.setPosition(objPath.pX, objPath.pY, objPath.pZ);

            let start = this._createRoadPoint(objPath.path, nodePath);
            if (start){
                this.currPath.push(start);
            }
        }

        this._triggerFinished('path');
    }

    private _createRoadPoint(objPoint: any, parent: Node){
        if (!objPoint) {
            return null;
        }

        let nodeRoadPoint = new Node(objPoint.name);
        nodeRoadPoint.parent = parent;
        nodeRoadPoint.setPosition(objPoint.pX, objPoint.pY, objPoint.pZ);
        nodeRoadPoint.setScale(objPoint.sX, objPoint.sY, objPoint.sZ);
        nodeRoadPoint.eulerAngles = new Vec3(objPoint.rX, objPoint.rY, objPoint.rZ);
        let point = nodeRoadPoint.addComponent(RoadPoint);
        point.type = objPoint.type;
        point.moveType = objPoint.moveType;
        point.clockwise = objPoint.clockwise;
        point.direction = objPoint.direction;
        point.delayTime = objPoint.delayTime;
        point.interval = objPoint.interval;
        point.speed = objPoint.speed;
        point.cars = objPoint.cars;

        if (point.type === RoadPoint.RoadPointType.GOODBYE) {
            this.maxProgress++;
        }


        if (objPoint.nextStation) {
            point.nextStation = this._createRoadPoint(objPoint.nextStation, parent);
        }

        return nodeRoadPoint;
    }

    private _triggerFinished(type: string){

        let tips = '';
        switch (type) {
            case 'plane':
                tips = 'Building ground...';
                break;
            case 'road':
                tips = 'Building road...';
                break;
            case 'tree':
                tips = 'Planting trees...';
                break;
            case 'house':
                tips = 'Building houses...';
                break;
            case 'sign':
                tips = 'Painting landmarks...';
                break;
        }

        if (tips) {
            CustomEventListener.dispatchEvent('updateLoading', 10, tips);
        }

        this._currProgress++;
        if (this._currProgress >= this._maxProgress && this._completeCb) {
            this._completeCb();
        }
    }

    private _recycleModel(type: string) {
        let nodeParent = this.node.getChildByName(type);
        if (!nodeParent) {
            return;
        }

        for (let idx = 0; idx < nodeParent.children.length; idx++) {
            let child = nodeParent.children[idx];
            PoolManager.setNode(child);
        }
    }
}
