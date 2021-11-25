
import { _decorator, Component, Node } from 'cc';
import { ModuleType } from '../../Core/Data/ModuleType';
import { Module } from '../../Core/MVC/Module';
const { ccclass, property } = _decorator;

/**
 * 
 * github = https://github.com/wangzhen7617/CocosCreator-Scaffold
 * 
 * Predefined variables
 * DateTime = Mon Nov 22 2021 19:34:31 GMT+0800 (中国标准时间)
 * Author = <wangzhen7617>
 * FileBasename = HotUpdateModule.ts
 * FileBasenameNoExtension = HotUpdateModule
 * URL = db://assets/Script/Modules/Hotupdate/HotUpdateModule.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/zh/
 *
 */

@ccclass('HotUpdateModule')
export class HotUpdateModule extends Module {

    constructor(name: string) {
        super();
        this.name = name
        this.pushView('HotUpdateViewUI', false);
    }

    public getModuleName(): string {
        return ModuleType.HOT_UPDATE;
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
