
import { _decorator, Component, AudioSource, assert, game } from 'cc';
import { AudioManager } from './AudioManager';
const { ccclass, property } = _decorator;

@ccclass('GameRoot')
export class GameRoot extends Component {
    
    @property(AudioSource)
    private _audioSource: AudioSource = null!;

    onLoad () {
        const audioSource = this.getComponent(AudioSource)!;
        assert(audioSource);
        this._audioSource = audioSource;
        game.addPersistRootNode(this.node);

        // init AudioManager
        AudioManager.init(audioSource);
    }
}