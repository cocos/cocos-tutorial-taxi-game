import { _decorator, Component, Node } from "cc";
const { ccclass, property } = _decorator;

enum EventName {
    GREETING = 'greeting',
    GOODBYE = 'goodbye',
    FINISHED_WALK = 'finished-walk',
    START_BRAKING = 'start-braking',
    END_BRAKING = 'end-braking',
    SHOW_COIN = 'show-coin',
    GAME_START = 'game-start',
    GAME_OVER = 'game-over',
    NEW_LEVEL = 'new-level',
    SHOW_TALK = 'show-talk',
    SHOW_GUIDE = 'show-guide',
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
    TOOTING1 = 'tooting1',
    TOOTING2 = 'tooting2',
    WIN = 'win',
}

enum CarGroup {
    NORMAL = 1 << 0,
    MAIN_CAR = 1 << 1,
    OTHER_CAR = 1 << 2,
}

@ccclass("Constants")
export class Constants {
    public static EventName = EventName;
    public static CustomerState = CustomerState;
    public static AudioSource = AudioSource;
    public static CarGroup = CarGroup;
    public static talkTable = [
        'Please hurry up.\n I have a plane to catch',
        'The most beautiful day \nis not the rainy day',
    ];

    public static UIPage = {
        mainUI: 'mainUI',
        gameUI: 'gameUI',
        resultUI: 'resultUI',
    };
}
