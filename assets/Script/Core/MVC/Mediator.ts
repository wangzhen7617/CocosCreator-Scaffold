
import { _decorator, Component, Node, CCObject, UITransform } from 'cc';
import { UIMgr } from '../Mgr/UIMgr';
import { AppFacade } from './AppFacade';
import { Dispatcher } from './Dispatcher';
import { DispatcherEvent } from './DispatcherEvent';
import { Module } from './Module';
const { ccclass, property } = _decorator;

/**
 * 
 * github = https://github.com/wangzhen7617/CocosCreator-Scaffold
 * 
 * Predefined variables
 * DateTime = Mon Nov 22 2021 16:46:01 GMT+0800 (中国标准时间)
 * Author = <wangzhen7617>
 * FileBasename = Mediator.ts
 * FileBasenameNoExtension = Mediator
 * URL = db://assets/Script/Core/MVC/Mediator.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/zh/
 *
 */

@ccclass('Mediator')
export class Mediator extends Component {

    private _dispatcher: Dispatcher;
    private _moduleView: Module;
    private _savedUIEventList: any[] = [];
    protected proxy: any;
    private sendToUIEventList: Array<string> = [];
    private moduleEventList: Array<string> = [];

    public setDispatcher = (dispatcher: Dispatcher): void => {
        this._dispatcher = dispatcher;
        this.addEvent();
    };

    protected addEvent(): void { }

    protected removeEvent(): void {
        for (let i: number = 0; i < this.sendToUIEventList.length; i++) {
            this.removeSendToUIEvent(this.sendToUIEventList[i]);
        }
    }

    public getNewUI(): Node {
        throw 'IMediator.getNewUI : please override this function';
    }

    public createModuleView(): any {
        this._moduleView = this.getNewUI() as Module;
        this.addModuleEvent();
        return this._moduleView;
    }

    public getModuleView(): any {
        return this._moduleView;
    }

    public getModuleParent(): any {
        let moduleView: any = this.getModuleView();
        if (moduleView && moduleView.parent) {
            return moduleView.parent;
        }
        return null;
    }

    public addModuleToScene(parent: any): any {
        let view: any = this.createModuleView();
        view.getComponent(UITransform).width = parent.getComponent(UITransform).width;
        view.getComponent(UITransform).height = parent.getComponent(UITransform).height;
        view.dispatcher.vo = this.proxy.vo;
        this.onModulePreAddToScene();
        parent.addChild(view);
        setTimeout(this.checkSaveEvent, 50);  //TODO 后续
        return view;
    }

    private checkSaveEvent = (): void => {
        this.onModuleAddedToScene();
        while (this._savedUIEventList.length > 0) {
            let event: any = this._savedUIEventList.shift();
            let e: DispatcherEvent = new DispatcherEvent(event.type, false, event.data);
            this.getModuleDispatcher().dispatchEvent(e);
        }
    };

    protected onModulePreAddToScene(): void { }

    protected onModuleAddedToScene(): void { }

    protected getModuleDispatcher(): any {
        if (this._moduleView != null && this._moduleView.dispatcher != null) {
            return this._moduleView.dispatcher;
        }
        return new Dispatcher();
    }

    protected addModuleEvent(): void {
        // this.getModuleDispatcher().on(ModuleEventType.MODULE_UI_EMPTY,this.onModuleUIEmpty,this);
    }

    protected removeModuleEvent(): void {
        // this.getModuleDispatcher().off(ModuleEventType.MODULE_UI_EMPTY,this.onModuleUIEmpty,this);
        let d: any = this.getModuleDispatcher();
        while (this.moduleEventList.length > 0) {
            let eventName: string = this.moduleEventList.pop();
            d.off(eventName, this.onSendUINotification, this);
        }
    }

    private onModuleUIEmpty(): void {
        UIMgr.removeModule(this._moduleView.getModuleName());
    }

    protected addNotification(eventName: string, handler: (this: void) => void): void {
        this._dispatcher.on(eventName, handler, this);
    }

    protected removeNotification(eventName: string, handler: (this: void) => void): void {
        this._dispatcher.off(eventName, handler, this);
    }

    protected sendNotification(eventName: string, data?: any) {
        this._dispatcher.emit(eventName, data, eventName);
    }

    protected addSendToUIEvent(eventName: string): void {
        this._dispatcher.on(eventName, this.onUINotification, this);
        this.sendToUIEventList.push(eventName);
    }

    protected removeSendToUIEvent(eventName: string): void {
        this._dispatcher.off(eventName, this.onUINotification, this);
    }

    protected onUINotification(message: any, eventName: string): void {
        if (this._moduleView == null) {
            let eventData: any = message;
            if (eventData && eventData.needSave) {
                this._savedUIEventList.push({ type: eventName, data: eventData });
            }
        } else {
            this.getModuleDispatcher().emit(eventName, message);
        }
    }

    protected addUISendOutEvent(eventName: string): void {
        this.getModuleDispatcher().on(eventName, this.onSendUINotification, this);
        this.moduleEventList.push(eventName);
    }

    // protected removeUISendOutEvent(eventName:string):void
    // {
    //     this.getModuleDispatcher().off(eventName,this.onSendUINotification,this);
    // }

    protected onSendUINotification(message: any, eventName: string): void {
        this.sendNotification(eventName, message);
    }

    public removeModule = (): void => {
        if (this._moduleView.isValid) {
            this.removeModuleEvent();
            this._moduleView.active = false;
            this._moduleView.parent.removeChild(this._moduleView);
            this._moduleView.destroy();
            this._moduleView = null;
        }
    };



    protected getModuleVO(type: string): any {
        let proxy: any = this.getProxy(type);
        if (proxy) {
            return proxy.getVO();
        }
        return {};
    }


    public setProxy = (proxy: any): void => {
        this.proxy = proxy;
    };

    protected getProxy(type: string): any {
        return AppFacade.getInstance().getProxy(type);
    }
}

