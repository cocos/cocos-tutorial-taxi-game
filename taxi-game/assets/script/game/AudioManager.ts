import { _decorator, Component, Node, loader, AudioClip } from "cc";
const { ccclass, property } = _decorator;

@ccclass("AudioManager")
export class AudioManager {
    public static playMusic(name: string) {
        const path = `audio/music/${name}`;
        loader.loadRes(path, AudioClip, (err: any, clip: AudioClip) => {
            if (err) {
                console.warn(err);
                return;
            }

            clip.setLoop(true);
            clip.play();
        });
    }

    public static playSound(name: string) {
        const path = `audio/sound/${name}`;
        loader.loadRes(path, AudioClip, (err: any, clip: AudioClip) => {
            if (err) {
                console.warn(err);
                return;
            }

            clip.setLoop(false);
            clip.playOneShot(1);
        });
    }
}
