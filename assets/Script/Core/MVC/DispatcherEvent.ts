
import { _decorator, Event } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 
 * github = https://github.com/wangzhen7617/CocosCreator-Scaffold
 * 
 * Predefined variables
 * DateTime = Mon Nov 22 2021 16:40:58 GMT+0800 (中国标准时间)
 * Author = <wangzhen7617>
 * FileBasename = DispatcherEvent.ts
 * FileBasenameNoExtension = DispatcherEvent
 * URL = db://assets/Script/Core/MVC/DispatcherEvent.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/zh/
 *
 */

@ccclass('DispatcherEvent')
export class DispatcherEvent extends Event {

    public detail: any = null;  // 自定义的属性

    constructor(name: string, bubbles?: boolean, detail?: any) {
        //@ts-ignore
        super(name, bubbles);
        this.detail = detail;
    }

}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.3/manual/zh/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.3/manual/zh/scripting/ccclass.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.3/manual/zh/scripting/life-cycle-callbacks.html
 */
