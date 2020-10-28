import { _decorator, Component, Node, loader, Prefab } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ResUtil')
export class ResUtil {
    public static getMap(level: number, cb: Function){
        let map = 'gameMap/data/map';
        if (level >= 100) {
            map += `${level}`;
        } else if (level >= 10) {
            map += `1${level}`;
        } else {
            map += `10${level}`;
        }

        loader.loadRes(map, null, (err: any, txtAsset: any)=>{
            if(err){
                cb(err, txtAsset);
                return;
            }

            console.log(txtAsset);
            if (window['LZString']) {
                let content = window['LZString'].decompressFromEncodedURIComponent(txtAsset._file);
                content = JSON.parse(content);
                cb(null, content);
            } else {
                cb('failed');
            }
        });
    }

    public static getMapObjs(type: string, arrName: Array<string>, progressCb?: Function, completeCb?: Function) {
        let arrUrls = [];
        for (let i = 0; i < arrName.length; i++) {
            arrUrls.push(`gameMap/${type}/${arrName[i]}`);
        }

        loader.loadResArray(arrUrls, Prefab, progressCb, completeCb);
    }
}
