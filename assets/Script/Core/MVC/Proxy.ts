
import { _decorator, Component, Node, log } from 'cc';
import { HotUpdateVO } from '../../Modules/Hotupdate/Data/HotUpdateVO';
import { LoginVO } from '../../Modules/Login/Data/LoginVO';
import { NetworkVO } from '../../Modules/Network/Data/NetworkVO';
import { AppFacade } from './AppFacade';
import { Dispatcher } from './Dispatcher';
import { DispatcherEvent } from './DispatcherEvent';
const { ccclass, property } = _decorator;

/**
 * 
 * github = https://github.com/wangzhen7617/CocosCreator-Scaffold
 * 
 * Predefined variables
 * DateTime = Mon Nov 22 2021 16:32:46 GMT+0800 (中国标准时间)
 * Author = <wangzhen7617>
 * FileBasename = Proxy.ts
 * FileBasenameNoExtension = Proxy
 * URL = db://assets/Script/Core/MVC/Proxy.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/zh/
 *
 */

@ccclass('Proxy')
export class Proxy extends Component {

    private _dispatcher: Dispatcher;
    public vo:any
    private eventList: { [index: string]: any } = {};

    public setDispatcher = (dispatcher: Dispatcher): void => {
        this._dispatcher = dispatcher;
        this.addEvent();
    };

    protected addEvent(): void { }

    public removeEvent(): void {
        for (let i in this.eventList) {
            this.removeNotification(i, this.eventList[i]);
        }
    }

    protected addNotification = (eventName: string, handler: (this: void, event: DispatcherEvent) => void): void => {
        this._dispatcher.on(eventName, handler, this);
        this.eventList[eventName] = handler;
    };

    protected removeNotification = (eventName: string, handler: (this: void, event: DispatcherEvent) => void): void => {
        this._dispatcher.off(eventName, handler, this);
    };

    protected sendNotification = (eventName: string, data?: any): void => {
        this._dispatcher.emit(eventName, data)
    };

    public getVO = (): any => {
        return this.vo;
    };

    public getModuleVO = (type: string): any => {
        let proxy = this.getProxy(type);
        if (proxy) {
            return proxy.getVO();
        }
        return {};
    };

    public getProxy(type: string): Proxy {
        return AppFacade.getInstance().getProxy(type);
    }
}

