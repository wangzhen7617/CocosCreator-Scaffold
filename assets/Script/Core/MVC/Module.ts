
import { _decorator, Component, Node, instantiate, Widget, warn, resources, tween, isValid, log, game, Vec3, easing } from 'cc';
import { GlobalParams } from '../Data/GlobalParams';
import { ModuleEventType } from '../Data/ModuleEventType';
import { AssetsMgr } from '../Mgr/AssetsMgr';
import { UIMgr } from '../Mgr/UIMgr';
import { Stack } from '../Utils/Stack';
import { DispatchComponent } from './DispatchComponent';
import { Dispatcher } from './Dispatcher';
const { ccclass, property } = _decorator;

/**
 * 
 * github = https://github.com/wangzhen7617/CocosCreator-Scaffold
 * 
 * Predefined variables
 * DateTime = Mon Nov 22 2021 16:58:27 GMT+0800 (中国标准时间)
 * Author = <wangzhen7617>
 * FileBasename = Module.ts
 * FileBasenameNoExtension = Module
 * URL = db://assets/Script/Core/MVC/Module.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/zh/
 *
 */

@ccclass('Module')
export class Module extends Node {
    public dispatcher: Dispatcher;
    private uiStack: Stack;
    private uiChanging: boolean = false;
    private mask: any;
    private savedUIList: Array<any> = [];
    private lastPopUIName: string = '';

    constructor(name: string) {
        super();
        this.dispatcher = new Dispatcher();
        this.uiStack = new Stack();
        this.name = this.getModuleName();
        this.mask = instantiate(resources.get('Prefabs/MaskViewUI'));
        this.mask.zIndex = 500;

        let widget = this.addComponent(Widget);
        widget.isAlignLeft = true;
        widget.isAlignRight = true;

        widget.left = 0;
        widget.right = 0;
        widget.top = 0;
        widget.bottom = 0;
        widget.isAlignTop = true;
        widget.isAlignBottom = true;

        this.addEvent();
    }

    protected addEvent(): void {
        this.dispatcher.on(ModuleEventType.RETURN_TO_OLD_UI, this.onPopView, this);
        this.dispatcher.on(ModuleEventType.MODULE_PUSH_VIEW, this.onPushView, this);
        this.dispatcher.on(ModuleEventType.MODULE_JUMP_VIEW, this.onJumpView, this);
        this.dispatcher.on(ModuleEventType.MODULE_PUSH_COMPLETE, this.checkPushUI, this);
    }

    protected removeEvent(): void {
        this.dispatcher.off(ModuleEventType.RETURN_TO_OLD_UI, this.onPopView, this);
        this.dispatcher.off(ModuleEventType.MODULE_PUSH_VIEW, this.onPushView, this);
        this.dispatcher.off(ModuleEventType.MODULE_JUMP_VIEW, this.onJumpView, this);
        this.dispatcher.off(ModuleEventType.MODULE_PUSH_COMPLETE, this.checkPushUI, this);
    }

    private checkPushUI(): void {
        if (this.savedUIList.length > 0) {
            let ui: any = this.savedUIList.shift();
            this.pushView(ui.uiName, ui.showAnimation, ui.disposeTop, ui.hideTop, ui.data);
        }
    }

    private onJumpView(data: any): void {
        this.jumpToUI(data.uiName);
    }

    private onPushView(data: any): void {
        // warn('onPushView', data);
        if (data.load) {
            AssetsMgr.loadView(data.uiName, (err, res) => {
                this.pushView(data.uiName, data.showAnimation, data.disposeTop, data.hideTop, data.data);
            });
        } else {
            try {
                this.pushView(data.uiName, data.showAnimation, data.disposeTop, data.hideTop, data.data);
            } catch (error) {
                warn(error);
            }
        }
    }

    private onPopView(data: any): void {
        // warn('onPopView', data.view.name);
        this.popView(data.view, data.showAnimation, data.release);
    }

    protected pushView(uiName: string, showAnimation?: boolean, disposeTop?: boolean, hideTop?: boolean, data?: any): any {
        if (this.uiChanging == true) {
            this.savedUIList.push({ uiName: uiName, showAnimation: showAnimation, disposeTop: disposeTop, hideTop: hideTop, data: data });
            return;
        }
        if (showAnimation == null || typeof showAnimation == 'undefined') {
            showAnimation = true;
        }
        if (disposeTop == null || typeof disposeTop == 'undefined') {
            disposeTop = false;
        }
        if (hideTop == null || typeof hideTop == 'undefined') {
            hideTop = true;
        }
        if (typeof data == 'undefined') {
            data = null;
        }
        let lastUI: Node = this.uiStack.top();
        let newUI: Node = instantiate(resources.get('Prefabs/' + uiName));
        if (lastUI != null && lastUI.name == newUI.name) {
            //不能push两个一样的UI，防止双击
            newUI.destroy();
            return;
        }
        if (!newUI || !(newUI instanceof Node) || !newUI.isValid)
            UIMgr.showAlert(
                '提示',
                '网络异常，游戏加载失败，请重新登陆',
                () => { },
                () => {
                    game.end()
                },
                false
            );
        // let moduleDispatcher: any = newUI.getComponent('ModuleDispatcher');
        let DispatcherComponent = newUI.addComponent(DispatchComponent)
        DispatcherComponent.dispatcher = this.dispatcher;
        DispatcherComponent.data = data;


        // if (DispatcherComponent) {
        //     // DispatcherComponent.currentModuleName = this.getModuleName();
        //     // DispatcherComponent.showAnimation = showAnimation;
        // } else {
        //     warn('module 賦值失敗...................');
        // }
        this.lastPopUIName = '';
        this.addChild(newUI);
        this.dispatcher.emit(ModuleEventType.MODULE_TOP_UI_CHANGE, uiName);
        if (showAnimation && !GlobalParams.isAppBackGround) {
            this.uiChanging = true;
            if (!isValid(this.mask)) {
                this.mask = instantiate(resources.get('Prefabs/MaskViewUI'));
                this.mask.zIndex = 500;
            }
            this.addChild(this.mask);
            if (lastUI != null) {
                if (disposeTop) {
                    lastUI.destroy();
                    this.uiStack.pop();
                } else if (hideTop) {
                    lastUI.active = false;
                }
            }
            let t = tween;
            t(newUI).to(0.2, { scale: Vec3.ONE }, { easing: "backOut" })
                .call(() => {
                    this.uiChanging = false;
                    this.uiStack.push(newUI);
                    if (isValid(this.mask)) {
                        this.mask.removeFromParent(false);
                    }
                    this.dispatcher.emit(ModuleEventType.MODULE_PUSH_COMPLETE);
                })
                .start();
        } else if (lastUI != null) {
            if (disposeTop) {
                lastUI.destroy();
                this.uiStack.pop();
            } else if (hideTop) {
                lastUI.active = false;
            }
            this.uiStack.push(newUI);
            this.dispatcher.emit(ModuleEventType.MODULE_PUSH_COMPLETE);
        } else {
            this.uiStack.push(newUI);
            this.dispatcher.emit(ModuleEventType.MODULE_PUSH_COMPLETE);
        }
        return newUI;
    }

    protected popView(view: any, showAnimation?: boolean, release?: boolean): void {
        // if(this.uiChanging == true)
        // {
        //     return;
        // }
        if (this.uiStack.size() == 1) {
            this.uiChanging = false;
            this.mask.removeFromParent(false);
            if (isValid(view)) view.destroy();
            return;
        }
        if (showAnimation == null || typeof showAnimation == 'undefined') {
            showAnimation = true;
        }
        let oldUI: any = view;
        if (!view) {
            oldUI = this.uiStack.pop();
        } else {
            this.uiStack.remove(view);
        }
        let topUI = this.uiStack.top();
        if (topUI != null) {
            topUI.active = true;
        }
        this.dispatcher.emit(ModuleEventType.MODULE_TOP_UI_CHANGE, topUI.name);
        if (isValid(oldUI)) {
            if (this.lastPopUIName == oldUI.name) {
                warn(this.getModuleName() + ' uiName相同');
                return;
            }
            this.lastPopUIName = oldUI.name;
            if (showAnimation && !GlobalParams.isAppBackGround) {
                this.uiChanging = true;
                oldUI.stopAllActions();

                let t = tween;
                t(oldUI)
                    .parallel(t().to(0.1, { scale: 0.95 }), t().to(0.11, { opacity: 0 }))
                    .call(() => {
                        oldUI.destroy();
                        if (release) {
                            AssetsMgr.releaseView(oldUI.name);
                        }
                        this.dispatcher.emit(ModuleEventType.MODULE_POP_COMPLETE);
                        if (topUI == null) {
                            this.dispatcher.emit(ModuleEventType.MODULE_UI_EMPTY);
                        }
                        this.uiChanging = false;
                    })
                    .start();
            } else {
                oldUI.destroy();
                if (release) {
                    AssetsMgr.releaseView(oldUI.name);
                }
                this.dispatcher.emit(ModuleEventType.MODULE_POP_COMPLETE);
                if (topUI == null) {
                    this.dispatcher.emit(ModuleEventType.MODULE_UI_EMPTY);
                }
            }
        } else {
            warn(this.getModuleName + ' oldUI is not valid ');
        }
    }

    //快速跳转到指定UI，调用之前请确保指定的UI已经在队列中，否则会出错
    private jumpToUI(uiName: string): void {
        let topUI: any = this.uiStack.top();
        if (topUI.name == uiName) {
            return;
        }

        let popUI: any = this.uiStack.pop();
        while (this.uiStack.size() > 0) {
            if (this.uiStack.top().name != uiName) {
                this.uiStack.pop().destroy();
            } else {
                this.popView(popUI);
                break;
            }
        }
    }

    public getModuleName(): string {
        throw 'Module: please override this function';
    }

    public getTopUIName(): string {
        if (this.uiStack.size() == 0) return '';
        return this.uiStack.top().name;
    }

    public destroy(): boolean {
        super.destroy();
        this.removeEvent();
        return true;
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
