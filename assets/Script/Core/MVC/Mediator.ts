
import { _decorator, Component, Node, CCObject, UITransform, isValid, log } from 'cc';
import { ModuleEventType } from '../Data/ModuleEventType';
import { NotifyEventType } from '../Data/NotifyEventType';
import { UIMgr } from '../Mgr/UIMgr';
import { AppFacade } from './AppFacade';
import { Dispatcher } from './Dispatcher';
import { DispatcherEvent } from './DispatcherEvent';
import { Module } from './Module';
import { Proxy } from './Proxy';
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
    private _savedUIEventList: DispatcherEvent[] = [];
    protected proxy: Proxy;
    private sendToUIEventList: Array<string> = [];
    private moduleEventList: Array<string> = [];

    public setDispatcher = (dispatcher: Dispatcher): void => {
        this._dispatcher = dispatcher;
        this.addEvent();
    };

    protected addEvent(): void { }

    public removeEvent(): void {
        for (let i: number = 0; i < this.sendToUIEventList.length; i++) {
            this.removeSendToUIEvent(this.sendToUIEventList[i]);
        }
    }

    public getNewUI(): Node {
        throw 'Mediator.getNewUI : please override this function';
    }

    public createModuleView(): Module {
        this._moduleView = this.getNewUI() as Module;
        this.addModuleEvent();
        return this._moduleView;
    }

    public getModuleView(): Module {
        return this._moduleView;
    }

    public getModuleParent(): Node {
        let moduleView = this.getModuleView();
        if (moduleView && moduleView.parent) {
            return moduleView.parent;
        }
        return null;
    }

    public addModuleToScene(parent: any): any {
        let view = this.createModuleView();
        view.getComponent(UITransform).width = parent.getComponent(UITransform).width;
        view.getComponent(UITransform).height = parent.getComponent(UITransform).height;
        view.dispatcher.vo = this.proxy.vo;
        this.onModulePreAddToScene();
        parent.addChild(view);
        setTimeout(this.checkSaveEvent, 50);  //TODO 后续
        return view;
    }

    private checkSaveEvent = (): void => {
        log(this.getModuleView().name + " checkSaveEvent", this._savedUIEventList)
        this.onModuleAddedToScene();
        while (this._savedUIEventList.length > 0) {
            let event = this._savedUIEventList.shift();
            this.getModuleDispatcher().emit(event.type, event.detail)
        }
    };

    protected onModulePreAddToScene(): void {
        log(this.getModuleView().name + " onModulePreAddToScene")
    }

    protected onModuleAddedToScene(): void {
        log(this.getModuleView().name + " onModuleAddedToScene")
    }

    private getModuleDispatcher(): Dispatcher {
        if (this._moduleView.isValid && this._moduleView.dispatcher != null) {
            return this._moduleView.dispatcher;
        }
        return new Dispatcher();
    }

    //*************************************************************************************** */
    protected addNotification(eventName: string, handler: (this: void) => void): void {
        this._dispatcher.on(eventName, handler, this);
    }

    protected removeNotification(eventName: string, handler: (this: void) => void): void {
        this._dispatcher.off(eventName, handler, this);
    }

    protected sendNotification(eventName: string, data?: any) {
        this._dispatcher.emit(eventName, data);
    }

  
    protected addModuleEvent(): void {
        this.getModuleDispatcher().on(ModuleEventType.MODULE_UI_EMPTY,this.onModuleUIEmpty,this);
        this.addUISendOutEvent(NotifyEventType.SCENE_SWITCH_SCENE);
    }

    protected removeModuleEvent(): void {
        this.getModuleDispatcher().off(ModuleEventType.MODULE_UI_EMPTY,this.onModuleUIEmpty,this);
        let d = this.getModuleDispatcher();
        while (this.moduleEventList.length > 0) {
            let eventName: string = this.moduleEventList.pop();
            d.off(eventName, this.onSendUINotification, this);
        }
    }

    private onModuleUIEmpty(): void {
        UIMgr.removeModule(this._moduleView.getModuleName());
    }

    //===================addSendToUIEvent======================*/
    protected addSendToUIEvent(eventName: string): void {
        this._dispatcher.on(eventName, this.onUINotification, this);
        this.sendToUIEventList.push(eventName);
    }

    protected removeSendToUIEvent(eventName: string): void {
        this._dispatcher.off(eventName, this.onUINotification, this);
    }

    private onUINotification(event: DispatcherEvent): void {
        if (!this._moduleView.isValid) {
            let eventData: any = event.detail;
            if (eventData && eventData.needSave) {
                this._savedUIEventList.push(event);
            }
        } else {
            this.getModuleDispatcher().emit(event.type, event.detail);
        }
    }
  //===================addUISendOutEvent======================*/
    protected addUISendOutEvent(eventName: string): void {
        this.getModuleDispatcher().on(eventName, this.onSendUINotification, this);
        this.moduleEventList.push(eventName);
    }

    protected removeUISendOutEvent(eventName: string): void {
        this.getModuleDispatcher().off(eventName, this.onSendUINotification, this);
    }

    private onSendUINotification(event: DispatcherEvent): void {
        this.sendNotification(event.type, event.detail);
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

