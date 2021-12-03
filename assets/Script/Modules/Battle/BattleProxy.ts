
import { _decorator, Component, Node } from 'cc';
import { Proxy } from '../../Core/MVC/Proxy';
import { BattleVO } from './Data/BattleVO';
const { ccclass, property } = _decorator;

/**
 * 
 * github = https://github.com/wangzhen7617/CocosCreator-Scaffold
 * 
 * Predefined variables
 * DateTime = Fri Dec 03 2021 14:38:46 GMT+0800 (中国标准时间)
 * Author = <wangzhen7617>
 * FileBasename = BattleProxy.ts
 * FileBasenameNoExtension = BattleProxy
 * URL = db://assets/Script/Modules/Battle/BattleProxy.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/zh/
 *
 */

@ccclass('BattleProxy')
export class BattleProxy extends Proxy {


    constructor() {
        super();
        this.vo = new BattleVO();
    }

    protected addEvent(): void {

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
