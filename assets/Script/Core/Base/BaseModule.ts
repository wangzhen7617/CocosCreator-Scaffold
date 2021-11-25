
import { _decorator, Component, Node } from 'cc';
import { ModuleEventType } from '../Data/ModuleEventType';
import { UIMgr } from '../Mgr/UIMgr';
import { DispatchComponent } from '../MVC/DispatchComponent';
import { Dispatcher } from '../MVC/Dispatcher';
import { BaseInterface } from './BaseInterface';
const { ccclass, property } = _decorator;

/**
 * 
 * github = https://github.com/wangzhen7617/CocosCreator-Scaffold
 * 
 * Predefined variables
 * DateTime = Tue Nov 23 2021 11:53:03 GMT+0800 (中国标准时间)
 * Author = <wangzhen7617>
 * FileBasename = BaseView.ts
 * FileBasenameNoExtension = BaseView
 * URL = db://assets/Script/Core/Base/BaseView.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/zh/
 *
 */

@ccclass('BaseModule')
export class BaseModule extends Component {

    public dispatcher: Dispatcher;
    public dispatcherData: any;

    protected start() {
        this.dispatcher = this.getComponent(DispatchComponent).dispatcher;
        this.dispatcherData = this.getComponent(DispatchComponent).data;
        this.initView();
        this.addEvent();
        this.customInit();
    }

    protected onDestroy(): void {
        this.removeEvent();
        this.customDestroy();
    }

    protected initView(): void { }
    protected addEvent(): void { }
    protected removeEvent(): void { }
    protected customInit(): void { }
    protected customDestroy(): void { }

    public sendEvent(eventName: string, eventData?: any): void {
        this.dispatcher.emit(eventName, eventData);
    }
    public attachEvent(eventName: string, func: any, target?: any): void {
        if (target) this.dispatcher.on(eventName, func, target);
        else this.dispatcher.on(eventName, func);
    }
    public detachEvent(eventName: string, func: any, target?: any): void {
        if (target) this.dispatcher.off(eventName, func, target);
        else this.dispatcher.off(eventName, func);
    }

    public closeThisWin(data?: any): void {
        if (!data || data.node) data = { showAnimation: true, view: this.node };
        UIMgr.hideLoading();
        this.sendEvent(ModuleEventType.RETURN_TO_OLD_UI, data);
    }

    public pushView(data): void {
        this.sendEvent(ModuleEventType.MODULE_PUSH_VIEW, data);
    }

    public pushViewPlayAnim(viewName: string, pushData?: any): void {
        this.sendEvent(ModuleEventType.MODULE_PUSH_VIEW, { uiName: viewName, showAnimation: true, hideTop: false, data: pushData });
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
