
import { _decorator, Component, Node } from 'cc';
import { ModuleType } from '../../Core/Data/ModuleType';
import { NotifyEventType } from '../../Core/Data/NotifyEventType';
import { Mediator } from '../../Core/MVC/Mediator';
import { LoginModule } from './LoginModule';
const { ccclass, property } = _decorator;

/**
 * 
 * github = https://github.com/wangzhen7617/CocosCreator-Scaffold
 * 
 * Predefined variables
 * DateTime = Fri Nov 26 2021 19:37:46 GMT+0800 (中国标准时间)
 * Author = <wangzhen7617>
 * FileBasename = LoginMediator.ts
 * FileBasenameNoExtension = LoginMediator
 * URL = db://assets/Script/Modules/Login/LoginMediator.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/zh/
 *
 */

@ccclass('LoginMediator')
export class LoginMediator extends Mediator {

    protected addEvent(): void {
        this.addSendToUIEvent(NotifyEventType.TEST_ON_POST)
    }

    protected addModuleEvent(): void {
        super.addModuleEvent();
        this.addUISendOutEvent(NotifyEventType.NETWORK_REQUEST_HTTP);
        this.addUISendOutEvent(NotifyEventType.TEST_TO_POST);
    }

    protected removeModuleEvent(): void {
        super.removeModuleEvent();
    }
    public getNewUI(): any {
        return new LoginModule();
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
