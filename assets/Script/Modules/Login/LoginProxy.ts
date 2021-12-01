
import { _decorator, Component, Node, warn, log } from 'cc';
import { NotifyEventType } from '../../Core/Data/NotifyEventType';
import { DispatcherEvent } from '../../Core/MVC/DispatcherEvent';
import { Proxy } from '../../Core/MVC/Proxy';
import { s2c } from '../Network/Data/s2c';
import { LoginState } from './Data/LoginState';
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
        this.addNotification(NotifyEventType.TEST_TO_POST, this.testToPost)
        this.addNotification(NotifyEventType.TEST_CREATE_WEBSOCKET, this.testCreateWS)


    }


    private testToPost(event: DispatcherEvent) {
        let url: string = "http://118.178.89.126/api/ip"
        this.sendNotification(NotifyEventType.NETWORK_REQUEST_HTTP, {
            requestType: 'POST',
            postData: 'ip=' + event.detail.ip,
            url: url + '?accessKey=alibaba-inc',
            handler: (res: any) => {
                this.sendNotification(NotifyEventType.TEST_ON_POST, res)
            },
            errHandler: (err: any) => {
            },
        });
    }

    private testCreateWS(event: DispatcherEvent) {
        this.vo.loginState = LoginState.LOGINED; // 测试 
        this.sendNotification(NotifyEventType.SOCKET_CREATE_GAME_SOCKET, event.detail)
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
