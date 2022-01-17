
import { _decorator, Component, Node, resources, JsonAsset } from 'cc';
import { Logger } from './Logger';
const { ccclass, property } = _decorator;

export class JsonUtil {

    static map: Map<string, any> = new Map();

    static get(name: string) {
        return this.map.get(name) || null
    }

    static load(name: string, callback: (json: any) => void): void {
        let path = 'configs/' + name;
        resources.load(path, JsonAsset, (err: Error | null, content: JsonAsset) => {
            if (err) {
                Logger.error(err.message);
            }
            this.map.set(name, content.json)
            callback(content.json)
        });
    }
}