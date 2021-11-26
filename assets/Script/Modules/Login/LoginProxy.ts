
import { _decorator, Component, Node } from 'cc';
import { Proxy } from '../../Core/MVC/Proxy';
import { LoginVO } from './Data/LoginVO';
const { ccclass, property } = _decorator;

/**
 * 
 * github = https://github.com/wangzhen7617/CocosCreator-Scaffold
 * 
 * Predefined variables
 * DateTime = Fri Nov 26 2021 19:42:56 GMT+0800 (中国标准时间)
 * Author = <wangzhen7617>
 * FileBasename = LoginProxy.ts
 * FileBasenameNoExtension = LoginProxy
 * URL = db://assets/Script/Modules/Login/LoginProxy.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/zh/
 *
 */
 
@ccclass('LoginProxy')
export class LoginProxy extends Proxy {

    constructor() {
        super();
        this.vo = new LoginVO();
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
