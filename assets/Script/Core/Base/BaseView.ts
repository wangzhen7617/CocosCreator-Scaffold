
import { _decorator, Component, Node } from 'cc';
import { SysEventType } from '../data/SysEventType';
import { Logger } from '../utils/Logger';
import { BaseModule } from './BaseModule';
const { ccclass, property } = _decorator;

/**
 * 
 * github = https://github.com/wangzhen7617/CocosCreator-Scaffold
 * 
 * Predefined variables
 * DateTime = Tue Nov 23 2021 19:11:08 GMT+0800 (中国标准时间)
 * Author = <wangzhen7617>
 * FileBasename = BaseView.ts
 * FileBasenameNoExtension = BaseView
 * URL = db://assets/Script/Core/Base/BaseView.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/zh/
 *
 */

@ccclass('BaseView')
export class BaseView extends BaseModule {
    @property(Node)
    public maskClose: Node = null;
    @property(Node)
    public btnClose: Node = null;

    protected start(): void {
        super.start();
    }

    protected initView(): void { }
    protected addEvent(): void {
        if (this.maskClose) this.maskClose.on(SysEventType.CLICK, this.clickMask, this);
        if (this.btnClose) this.btnClose.on(SysEventType.CLICK, this.clickClose, this);
    }
    protected customInit(): void { }

    protected removeEvent(): void { }

    protected customDestroy(): void { }

    protected clickMask(): void {
        Logger.log('==========clickMask==========');
        this.closeThisWin();
    }

    protected clickClose(): void {
        Logger.log('==========clickClose==========');
        this.closeThisWin();
        // this.closeThisWin({ showAnimation: true, view: this.node, release: true });
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
