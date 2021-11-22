
import { _decorator, Component, Node } from 'cc';
import { Proxy } from '../../Core/MVC/Proxy';
import { HotUpdateVO } from './Data/HotUpdateVO';
const { ccclass, property } = _decorator;

/**
 * 
 * github = https://github.com/wangzhen7617/CocosCreator-Scaffold
 * 
 * Predefined variables
 * DateTime = Mon Nov 22 2021 19:34:07 GMT+0800 (中国标准时间)
 * Author = <wangzhen7617>
 * FileBasename = HotupdateProxy.ts
 * FileBasenameNoExtension = HotupdateProxy
 * URL = db://assets/Script/Modules/Hotupdate/HotupdateProxy.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/zh/
 *
 */

@ccclass('HotUpdateProxy')
export class HotUpdateProxy extends Proxy {

    constructor() {
        super();
        this.vo = new HotUpdateVO();
    }

    protected addEvent(): void { }
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
