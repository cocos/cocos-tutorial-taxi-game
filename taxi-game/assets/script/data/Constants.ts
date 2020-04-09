import { _decorator, Component, Node } from "cc";
const { ccclass, property } = _decorator;

enum EventName {
    GREETING = 'greeting',
    GOODBYE = 'goodbye',
    FINISHED_WALK = 'finished-walk',
    START_BRAKING = 'start-braking',
    END_BRAKING = 'end-braking',
    SHOW_COIN = 'show-coin',
}

enum CustomerState {
    NONE,
    GREETING,
    GOODBYE,
}

enum AudioSource {
    BACKGROUND = 'background',
    CLICK = 'click',
    CRASH = 'crash',
    GETMONEY = 'getMoney',
    INCAR = 'inCar',
    NEWORDER = 'newOrder',
    START = 'start',
    STOP = 'stop',
    TOOTONG1 = 'tooting1',
    TOOTONG2 = 'tooting2',
    WIN = 'win',
}

@ccclass("Constants")
export class Constants {
    public static EventName = EventName;
    public static CustomerState = CustomerState;
    public static AudioSource = AudioSource;
}
