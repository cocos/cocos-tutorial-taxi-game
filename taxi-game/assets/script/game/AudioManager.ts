import { assert, assetManager, AudioClip, AudioSource, log } from "cc";

export class AudioManager {
    private static _audioSource?: AudioSource;
    private static _cachedAudioClipMap: Record<string, AudioClip> = {};

    // init AudioManager in GameRoot component.
    public static init (audioSource: AudioSource) {
        log('Init AudioManager !');
        AudioManager._audioSource = audioSource;
    }

    public static playMusic () {
        const audioSource = AudioManager._audioSource!;
        assert(audioSource, 'AudioManager not inited!');

        audioSource.play();
    }

    public static playSound(name: string) {
        const audioSource = AudioManager._audioSource!;
        assert(audioSource, 'AudioManager not inited!');

        const path = `audio/sound/${name}`;
        let cachedAudioClip = AudioManager._cachedAudioClipMap[path];
        if (cachedAudioClip) {
            audioSource.playOneShot(cachedAudioClip, 1);
        } else {
            assetManager.resources?.load(path, AudioClip, (err, clip) => {
                if (err) {
                    console.warn(err);
                    return;
                }
                
                AudioManager._cachedAudioClipMap[path] = clip;
                audioSource.playOneShot(clip, 1);
            });
        }
    }
}