
import { _decorator, Component, Node } from 'cc';
import { Dispatcher } from './Dispatcher';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = AppFacade
 * DateTime = Mon Nov 22 2021 15:06:22 GMT+0800 (中国标准时间)
 * Author = 乐观的摸摸头
 * FileBasename = AppFacade.ts
 * FileBasenameNoExtension = AppFacade
 * URL = db://assets/Script/Core/MVC/AppFacade.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/zh/
 *
 */

@ccclass('AppFacade')
export class AppFacade extends Component {

    /** 实例对象 */
    private static _instance: AppFacade = new AppFacade();

    private _dispatcher: Dispatcher = new Dispatcher();
    private _proxys: { [index: string]: any } = {};
    private _mediators: { [index: string]: any } = {};

    public static getInstance(): AppFacade {
        return this._instance;
    }

    public registerProxy(name: string, proxyObj: any): void {
        proxyObj.setDispatcher(this._dispatcher);
        AppFacade.getInstance()._proxys[name] = proxyObj;
    }

    public registerMediator(name: string, mediatorObj: any): void {
        mediatorObj.setDispatcher(this._dispatcher);
        let proxyObj: any = AppFacade.getInstance().getProxy(name);
        mediatorObj.setProxy(proxyObj);
        AppFacade.getInstance()._mediators[name] = mediatorObj;
    }

    public getProxy(name: string) {
        return AppFacade.getInstance()._proxys[name];
    }

    public getMediator(name: string) {
        return AppFacade.getInstance()._mediators[name];
    }

    public removeAll(): void {
        for (let i in AppFacade.getInstance()._proxys) {
            AppFacade.getInstance()._proxys[i].removeEvent();
        }
        for (let i in AppFacade.getInstance()._mediators) {
            AppFacade.getInstance()._mediators[i].removeEvent();
        }
        AppFacade.getInstance()._proxys = {};
        AppFacade.getInstance()._mediators = {};
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
