
import { _decorator, Component, Node, instantiate, resources, director, isValid, UITransform } from 'cc';
import { Loading } from '../common/Loading';
import { Facade } from '../puremvc/Facade';
import { Mediator } from '../puremvc/Mediator';
import { Logger } from '../utils/Logger';
const { ccclass, property } = _decorator;

/**
 * 
 * github = https://github.com/wangzhen7617/CocosCreator-Scaffold
 * 
 * Predefined variables
 * DateTime = Mon Nov 22 2021 17:19:00 GMT+0800 (中国标准时间)
 * Author = <wangzhen7617>
 * FileBasename = AlertMgr.ts
 * FileBasenameNoExtension = AlertMgr
 * URL = db://assets/Script/Core/Mgr/AlertMgr.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/zh/
 *
 */

@ccclass('UIMgr')
export class UIMgr extends Component {
    public static uiMap: Array<any> = [];
    private static mask: Node;
    private static alert: Node;
    private static tips: Node;
    private static loading: Node;

    public static init(): void {
        UIMgr.uiMap = [];
        //用于弹窗时挡住下面的UI，防止误触
        UIMgr.createMask();
        //弹出框
        UIMgr.createAlert();
        //tips
        UIMgr.tips = null;
        //loading
        UIMgr.createLoading();

        UIMgr.uiMap = null;
        UIMgr.mask = null;
        UIMgr.alert = null;
        UIMgr.tips = null;
        UIMgr.loading = null;
    }

    private static createMask(): void {
        UIMgr.mask = instantiate(resources.get('prefabs/common/Mask'));
        UIMgr.mask.getComponent(UITransform).priority = 9980;
    }

    private static createAlert(): void {
        UIMgr.alert = instantiate(resources.get('prefabs/common/Alert'));
        UIMgr.alert.getComponent(UITransform).priority = 9981;
    }

    private static createLoading(): void {
        UIMgr.loading = instantiate(resources.get('prefabs/common/Loading'));
        UIMgr.loading.getComponent(UITransform).priority = 9982;
    }

    public static getRootNode(): unknown {
        let scene = director.getScene();
        if (scene.isValid) {
            return scene.getChildByName('Canvas');
        }
        return new Node();
    }

    public static showLoading(
        str: string,
        hideLoad: boolean = false,
        count: number = 2 << 20,
        callBack?: (this: void) => void,
    ): void {
        Logger.log("show loading")
        if (!isValid(UIMgr.loading)) {
            UIMgr.createLoading();
        }
        if (UIMgr.loading.parent) {
            UIMgr.hideLoading();
        }
        if (!isValid(UIMgr.mask)) {
            UIMgr.createMask();
        }
        let loading: Loading = UIMgr.loading.getComponent(Loading);
        let rootNode: any = UIMgr.getRootNode();
        rootNode.addChild(UIMgr.mask);
        rootNode.addChild(UIMgr.loading);
        loading.showLoading(str, hideLoad, count, () => {
            Logger.log("test loading1")
            UIMgr.mask.removeFromParent();
            if (callBack) callBack()
        });

    }

    public static hideLoading(): void {
        if (isValid(UIMgr.loading)) {
            UIMgr.loading.getComponent(Loading).hideLoading();
        }
        if (isValid(UIMgr.mask)) {
            UIMgr.mask.removeFromParent();
        }
    }

    public static isLoading(): boolean {
        return isValid(UIMgr.loading) && UIMgr.loading.parent != null;
    }

    public static showTips(str: string, showTime?: number, posY?: number) {
        // if (!AlertManager.tips || !AlertManager.tips.parent) {
        //     AlertManager.tips = cc.instantiate(cc.loader.getRes('prefabs/TipsViewUI'));
        //     AlertManager.tips.zIndex = 9983;
        //     let rootNode: any = AlertManager.getRootNode();
        //     rootNode.addChild(AlertManager.tips);
        // }
        // AlertManager.tips.getComponent('TipsViewUI').show(str, showTime, posY);
    }

    public static showAlert(
        title: any,
        content: string,
        confirmCallBack?: (this: void) => void,
        cancelCallBack?: (this: void) => void,
        showCancel?: boolean,
        confirmStr?: string,
        cancelStr?: string,
        swapCallBack?: boolean
    ): void {
        // AudioManager.playSFX(GlobalParams.btn_sound);
        // Utils.nativeVibrate(shake.light);

        // if (!cc.isValid(AlertManager.alert)) {
        //     AlertManager.createAlert();
        // }
        // if (AlertManager.alert.parent) {
        //     AlertManager.alert.removeFromParent(false);
        // }
        // if (!cc.isValid(AlertManager.mask)) {
        //     AlertManager.createMask();
        // }
        // if (AlertManager.mask.parent) {
        //     AlertManager.mask.removeFromParent(false);
        // }
        // let rootNode: any = AlertManager.getRootNode();
        // let newConfirmCallBack = (): void => {
        //     AlertManager.mask.removeFromParent(false);
        //     this.topUIChange('');
        //     if (confirmCallBack) {
        //         confirmCallBack();
        //     }
        // };
        // let newCancelCallBack = (): void => {
        //     AlertManager.mask.removeFromParent(false);
        //     this.topUIChange('');
        //     if (cancelCallBack) {
        //         cancelCallBack();
        //     }
        // };
        // let maskConfirm = (): void => {
        //     AlertManager.alert.getComponent('AlertViewUI').confirmFun();
        // };
        // let maskCancel = (): void => {
        //     AlertManager.alert.getComponent('AlertViewUI').cancelFun();
        // };
        // AlertManager.mask.getComponent('MaskViewUI').setCancelCallback(swapCallBack ? maskConfirm : maskCancel);
        // AlertManager.alert.getComponent('AlertViewUI').show(title, content, newConfirmCallBack, newCancelCallBack, showCancel, confirmStr, cancelStr);
        // rootNode.addChild(AlertManager.mask);
        // rootNode.addChild(AlertManager.alert);
        // this.topUIChange('AlertViewUI');
    }

    public static hideAlert(): boolean {
        // if (cc.isValid(AlertManager.alert) && AlertManager.alert.parent != null) {
        //     AlertManager.alert.getComponent('AlertViewUI').hide();
        //     return true;
        // }
        return false;
    }

    public static showModule(moduleName: string): void {
        let mediator: Mediator = Facade.getInstance().getMediator(moduleName);
        if (mediator != null) {
            if (mediator.getModuleView() != null) {
                UIMgr.removeModule(moduleName);
            }
            let rootNode: any = UIMgr.getRootNode();
            let newUI: any = mediator.addModuleToScene(rootNode);
            UIMgr.uiMap.push({ moduleName: moduleName, ui: newUI });
        } else {
            Logger.warn('showModule......mediator..null....' + moduleName);
        }
    }

    public static removeModule(moduleName: string): void {
        Logger.log('====removeModule===', moduleName);
        let moduleUI: any = UIMgr.getModuleUI(moduleName);
        if (moduleUI != null) {
            UIMgr.destroyModuleUI(moduleUI);
            UIMgr.removeMoudleUI(moduleName);
        }
    }

    private static destroyModuleUI(moduleUI: any): void {
        let mediator = Facade.getInstance().getMediator(moduleUI.getModuleName());
        mediator.removeModule();
    }

    public static hasModule(moduleName: string): boolean {
        return UIMgr.getModuleUI(moduleName) != null;
    }

    public static getModuleUI(moduleName: string): any {
        for (let i: number = 0; i < UIMgr.uiMap.length; i++) {
            if (UIMgr.uiMap[i].moduleName == moduleName) {
                return UIMgr.uiMap[i].ui;
            }
        }
        return null;
    }

    private static removeMoudleUI(moduleName: string): void {
        for (let i: number = UIMgr.uiMap.length - 1; i >= 0; i--) {
            if (UIMgr.uiMap[i].moduleName == moduleName) {
                UIMgr.uiMap.splice(i, 1);
                break;
            }
        }
    }

    public static removeAllModules(): void {
        while (UIMgr.uiMap.length > 0) {
            UIMgr.destroyModuleUI(UIMgr.uiMap.pop().ui);
        }
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
