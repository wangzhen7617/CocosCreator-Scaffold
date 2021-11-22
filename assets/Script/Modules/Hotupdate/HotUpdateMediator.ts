
import { _decorator, Component, Node } from 'cc';
import { NotifyEventType } from '../../Core/Data/NotifyEventType';
import { Mediator } from '../../Core/MVC/Mediator';
import { HotUpdateModule } from './HotUpdateModule';
const { ccclass, property } = _decorator;

/**
 * 
 * github = https://github.com/wangzhen7617/CocosCreator-Scaffold
 * 
 * Predefined variables
 * DateTime = Mon Nov 22 2021 19:34:21 GMT+0800 (中国标准时间)
 * Author = <wangzhen7617>
 * FileBasename = HotUpdateMediator.ts
 * FileBasenameNoExtension = HotUpdateMediator
 * URL = db://assets/Script/Modules/Hotupdate/HotUpdateMediator.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/zh/
 *
 */

@ccclass('HotUpdateMediator')
export class HotUpdateMediator extends Mediator {

    constructor() {
        super();
    }

    protected addEvent(): void { }

    protected addModuleEvent(): void {
        super.addModuleEvent();
        this.addUISendOutEvent(NotifyEventType.NETWORK_REQUEST_HTTP);
    }

    public getNewUI(): any {
        return new HotUpdateModule();
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
