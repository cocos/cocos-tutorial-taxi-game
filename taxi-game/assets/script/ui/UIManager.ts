import { _decorator, Component, Node, find, loader, Prefab, instantiate } from "cc";
const { ccclass, property } = _decorator;

interface PageActive{
    show: () => {},
    hide: () => {},
}

@ccclass("UIManager")
export class UIManager {
    static _dictPanel = new Map <string, Node>();

    public static showDialog(name: string, cb?: Function, ...args: []){
        const scriptName = name.substr(0,1).toUpperCase() + name.substr(1);
        if(this._dictPanel.has(name)){
            const panel = this._dictPanel.get(name)!;
            const parent = find('Canvas');
            panel.parent = parent;
            const comp = panel.getComponent(scriptName);
            if (comp && (comp as Component & PageActive)['show']){
                (comp as Component & PageActive)['show'].apply(comp, args);
            }

            if(cb){
                cb();
            }

            return;
        }

        const path = `ui/${name}`;
        loader.loadRes(path, Prefab, (err, prefab) => {
            if (err) {
                console.warn(err);
                return;
            }

            const panel = instantiate(prefab!);
            this._dictPanel.set(name, panel);
            const parent = find('Canvas');
            panel.parent = parent;
            const comp = panel.getComponent(scriptName);
            if (comp && (comp as Component & PageActive)['show']) {
                (comp as Component & PageActive)['show'].apply(comp, args);
            }

            if (cb) {
                cb();
            }
        });
    }

    public static hideDialog(name: string, cb?: Function){
        if(this._dictPanel.has(name)){
            const scriptName = name.substr(0, 1).toUpperCase() + name.substr(1);
            const panel = this._dictPanel.get(name)!;
            panel.parent = null;
            const comp = panel.getComponent(scriptName);
            if (comp && (comp as Component & PageActive)['hide']) {
                (comp as Component & PageActive)['hide'].apply(comp);
            }

            if (cb) {
                cb();
            }
        }
    }
}
