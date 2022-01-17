import { Dispatcher } from "./Dispatcher";
import { Mediator } from "./Mediator";
import { Proxy } from "./Proxy";



export class Facade {
    /** 实例对象 */
    static instanceMap: Object = {};

    private _dispatcher: Dispatcher = new Dispatcher();
    private _proxys: { [index: string]: Proxy } = {};
    private _mediators: { [index: string]: Mediator } = {};

    static MULTITON_KEY: string = "Facade";
    static MULTITON_MSG: string = "Facade instance for this multiton key already constructed!";
    static STARTUP: string = "startup";

    constructor(key: string) {
        if (Facade.instanceMap[key])
            throw Error(Facade.MULTITON_MSG);
        Facade.instanceMap[key] = this;
    }

    static getInstance(): Facade {
        if (!Facade.instanceMap[Facade.MULTITON_KEY])
            Facade.instanceMap[Facade.MULTITON_KEY] = new Facade(Facade.MULTITON_KEY);

        return Facade.instanceMap[Facade.MULTITON_KEY];
    }

    public registerProxy(name: string, proxyObj: Proxy): void {
        proxyObj.setDispatcher(this._dispatcher);
        Facade.getInstance()._proxys[name] = proxyObj;
    }

    public registerMediator(name: string, mediatorObj: Mediator): void {
        mediatorObj.setDispatcher(this._dispatcher);
        let proxyObj = Facade.getInstance().getProxy(name);
        mediatorObj.setProxy(proxyObj);
        Facade.getInstance()._mediators[name] = mediatorObj;
    }

    public getProxy(name: string) {
        return Facade.getInstance()._proxys[name];
    }

    public getMediator(name: string) {
        return Facade.getInstance()._mediators[name];
    }

    public removeAll(): void {
        for (let i in Facade.getInstance()._proxys) {
            Facade.getInstance()._proxys[i].removeEvent();
        }
        for (let i in Facade.getInstance()._mediators) {
            Facade.getInstance()._mediators[i].removeEvent();
        }
        Facade.getInstance()._proxys = {};
        Facade.getInstance()._mediators = {};
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
