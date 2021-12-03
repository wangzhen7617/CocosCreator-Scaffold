
import { _decorator, Component, Node } from 'cc';
import { ModuleType } from '../../Core/Data/ModuleType';
import { Module } from '../../Core/MVC/Module';
const { ccclass, property } = _decorator;

/**
 * 
 * github = https://github.com/wangzhen7617/CocosCreator-Scaffold
 * 
 * Predefined variables
 * DateTime = Fri Dec 03 2021 14:38:58 GMT+0800 (中国标准时间)
 * Author = <wangzhen7617>
 * FileBasename = BattleModule.ts
 * FileBasenameNoExtension = BattleModule
 * URL = db://assets/Script/Modules/Battle/BattleModule.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/zh/
 *
 */
 
@ccclass('BattleModule')
export class BattleModule extends Module {

    constructor() {
        super();
        this.pushView('BattleViewUI', false);
    }

    public getModuleName(): string {
        return ModuleType.Battle;
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
