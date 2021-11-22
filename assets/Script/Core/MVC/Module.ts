
import { _decorator, Component, Node, instantiate, Widget, warn, resources, tween, isValid, log, game } from 'cc';
import { GlobalParams } from '../Data/GlobalParams';
import { ModuleEventType } from '../Data/ModuleEventType';
import { UIMgr } from '../Mgr/UIMgr';
import { Stack } from '../Utils/Stack';
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

    constructor() {
        super();
        this.dispatcher = new Dispatcher();
        this.uiStack = new Stack();

        this.mask = instantiate(resources.get('prefabs/MaskUI'));
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
            this.loadView(data.uiName, (err, res) => {
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
        let lastUI: any = this.uiStack.top();
        let newUI: any = instantiate(resources.get('prefabs/' + uiName));
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
        let moduleDispatcher: any = newUI.getComponent('ModuleDispatcher');
        if (moduleDispatcher) {
            moduleDispatcher.dispatcher = this.dispatcher;
            moduleDispatcher.data = data;
            moduleDispatcher.currentModuleName = this.getModuleName();
            moduleDispatcher.showAnimation = showAnimation;
        } else {
            warn('module 賦值失敗...................');
        }
        this.lastPopUIName = '';
        log('======nweUI====', uiName);
        this.addChild(newUI);
        this.dispatcher.emit(ModuleEventType.MODULE_TOP_UI_CHANGE, uiName);
        if (showAnimation && !GlobalParams.isAppBackGround) {
            this.uiChanging = true;
            if (!isValid(this.mask)) {
                this.mask = instantiate(resources.get('prefabs/MaskUI'));
                this.mask.zIndex = 500;
            }
            this.addChild(this.mask);
            newUI.opacity = 0;
            if (lastUI != null) {
                if (disposeTop) {
                    lastUI.destroy();
                    this.uiStack.pop();
                } else if (hideTop) {
                    lastUI.active = false;
                }
            }
            let t = tween;
            t(newUI)
                .set({ opacity: 0, scale: 0.8 })
                .parallel(t().to(0.15, { scale: 1.04 }, { easing: 'sineOut' }), t().to(0.15, { opacity: 255 }))

                .to(0.15, { scale: 1 }, { easing: 'sineIn' })
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
        let topUI: any = this.uiStack.top();
        if (topUI != null) {
            topUI.active = true;
        }
        this.dispatcher.emit(ModuleEventType.MODULE_TOP_UI_CHANGE, topUI.name);
        if (isValid(oldUI)) {
            if (this.lastPopUIName == oldUI.name) {
                log('===uiName相同，pop失败====');
                return;
            }
            this.lastPopUIName = oldUI.name;

            log('=====pop view=====', oldUI.name);
            if (showAnimation && !GlobalParams.isAppBackGround) {
                this.uiChanging = true;
                oldUI.stopAllActions();

                let t = tween;
                t(oldUI)
                    .parallel(t().to(0.1, { scale: 0.95 }), t().to(0.11, { opacity: 0 }))
                    .call(() => {
                        oldUI.destroy();
                        if (release) {
                            this.releaseView(oldUI.name);
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
                    this.releaseView(oldUI.name);
                }
                this.dispatcher.emit(ModuleEventType.MODULE_POP_COMPLETE);
                if (topUI == null) {
                    this.dispatcher.emit(ModuleEventType.MODULE_UI_EMPTY);
                }
            }
        } else {
            log('=========old ui is null===========');
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
        throw 'IModule: please override this function';
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

    private loadView(name: string, cb: (_err: Error, _res: any) => void): void {
        UIMgr.showLoading('加载中');
        cc.loader.loadRes(`prefabs/${name}`, cc.Prefab, (err: Error, res: any) => {
            AlertManager.hideLoading();
            if (err) {
                AlertManager.showTips('加载失败，请稍后重试');
                cb(err, null);
                return;
            }
            cb(null, res);
        });
    }
    // add 释放view的所有引用资源
    private releaseView(name: string): void {
        if (!cc.sys.isNative) cc.loader.release(cc.loader.getDependsRecursively(`prefabs/${name}`));
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
