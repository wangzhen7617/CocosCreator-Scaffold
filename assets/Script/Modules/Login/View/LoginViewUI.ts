
import { _decorator, Component, Node, CCObject, Event, Label } from 'cc';
import { BaseModule } from '../../../Core/Base/BaseModule';
import { BaseView } from '../../../Core/Base/BaseView';
import { NotifyEventType } from '../../../Core/Data/NotifyEventType';
import { SysEventType } from '../../../Core/Data/SysEventType';
const { ccclass, property } = _decorator;

/**
 * 
 * github = https://github.com/wangzhen7617/CocosCreator-Scaffold
 * 
 * Predefined variables
 * DateTime = Fri Nov 26 2021 19:49:29 GMT+0800 (中国标准时间)
 * Author = <wangzhen7617>
 * FileBasename = LoginViewUI.ts
 * FileBasenameNoExtension = LoginViewUI
 * URL = db://assets/Script/Modules/Login/View/LoginViewUI.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/zh/
 *
 */

@ccclass('LoginViewUI')
export class LoginViewUI extends BaseModule {

    @property(Node)
    btnPostUrl: Node = null;

    @property(Node)
    btnCreateWS: Node = null;
    @property(Node)
    btnSendPackage: Node = null;


    @property(Label)
    InfoLab: Label = null;

    start() {
        super.start()
        this.sendEvent(NotifyEventType.SWITCH_SCENE_TO_BATTLE)

    }

    protected initView() {
        this.InfoLab.string = 'This Is LoginViewUI'
    }

    protected addEvent() {
        this.btnPostUrl.on(SysEventType.CLICK, this.clickPostUrl, this)
        this.btnCreateWS.on(SysEventType.CLICK, this.clickCreateWs, this)
        this.btnSendPackage.on(SysEventType.CLICK, this.clickSendPACKAGE, this)

        this.attachEvent(NotifyEventType.TEST_ON_POST, this.onPostRes, this)
    }

    protected removeEvent() {
        this.detachEvent(NotifyEventType.TEST_ON_POST, this.onPostRes, this)

    }

    private clickPostUrl() {
        this.sendEvent(NotifyEventType.TEST_TO_POST, { ip: '127.0.0.1' })
    }

    private onPostRes(data: any) {
        this.InfoLab.string = JSON.stringify(data)
    }

    private clickCreateWs() {
        this.sendEvent(NotifyEventType.TEST_CREATE_WEBSOCKET, { ws: "ws://121.40.165.18:8800" })  //地址来自：http://www.websocket-test.com/
    }

    private clickSendPACKAGE() {

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
