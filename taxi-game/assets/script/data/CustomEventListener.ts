import { _decorator, Component, Node } from "cc";
const { ccclass, property } = _decorator;

interface IEventData {
    func: Function;
    target: any;
}

interface IEvent {
    [eventName: string]: IEventData[];
}

@ccclass("CustomEventListener")
export class CustomEventListener extends Component {
    public static handle: IEvent = {};

    public static on(eventName: string, cb:Function, target?: any){
        if(!this.handle[eventName]){
            this.handle[eventName] = [];
        }

        const data: IEventData = { func: cb, target };
        this.handle[eventName].push(data);
    }

    public static off(eventName: string, cb: Function, target?: any){
        const list = this.handle[eventName];
        if(!list || list.length <=0){
            return;
        }

        for (let i = 0; i < list.length; i++) {
            const event = list[i];
            if(event.func === cb && (!target || target === event.target)){
                list.splice(i, 1);
                break;
            }
        }
    }

    public static dispatchEvent (eventName: string, ...args:any){
        const list = this.handle[eventName];
        if (!list || list.length <= 0) {
            return;
        }

        for (let i = 0; i < list.length; i++) {
            const event = list[i];
            event.func.apply(event.target, args);
        }
    }
}
