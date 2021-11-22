
import { _decorator, Component, Node, instantiate, resources, director, CCObject } from 'cc';
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
    private static mask: any;
    private static alert: any;
    private static tips: any;
    private static loading: any;

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
        UIMgr.mask = instantiate(resources.get('prefabs/MaskUI'));
        UIMgr.mask.opacity = 100;
        UIMgr.mask.zIndex = 9980;
    }

    private static createAlert(): void {
        UIMgr.alert = instantiate(resources.get('prefabs/AlertViewUI'));
        UIMgr.alert.zIndex = 9981;
    }

    private static createLoading(): void {
        UIMgr.loading = instantiate(resources.get('prefabs/LoadingViewUI'));
        UIMgr.loading.zIndex = 9982;
    }

    public static getRootNode(): unknown {
        // cc.log('=====getRootNode====');
        let scene = director.getScene();
        if (scene.isValid) {
            return scene.getChildByName('Canvas');
        }
        return new Node();
    }

    public static showLoading(
        str: string,
        callBack?: (this: void) => void,
        retryCallBack?: (this: void) => void,
        doRetryOnce?: boolean,
        totalCount?: number,
        b_hide_bg?: boolean,
        b_hideCount?: boolean,
        errorStr?: string
    ): void {
        // cc.log('=====showLoading===');
        if (errorStr) LoadingViewUI.errorStr = errorStr;
        if (b_hideCount) LoadingViewUI.b_hideCount = b_hideCount;
        if (!cc.isValid(AlertManager.loading)) {
            AlertManager.createLoading();
        }
        if (AlertManager.loading.parent) {
            AlertManager.hideLoading();
        }
        try {
            let loadingView: any = AlertManager.loading.getComponent('LoadingViewUI');
            let rootNode: any = AlertManager.getRootNode();
            rootNode.addChild(AlertManager.loading);
            loadingView.currentCount = 0;
            loadingView.totalCount = totalCount || 100;
            loadingView.showLoading(str, callBack, retryCallBack);

            if (doRetryOnce) {
                retryCallBack();
            }
        } catch (error) {
            AlertManager.showTips(error);
        }

        // loadingView.node.getChildByName("MaskUI").active = true;

        // if(str==i18n.t("TipsTxt.tips_game_ing")){
        //     // loadingView.node.getChildByName("bg").active = false;
        //     loadingView.node.getChildByName("MaskUI").active = true;
        // }else{
        //     // loadingView.node.getChildByName("bg").active = !b_hide_bg;
        // }
    }

    public static hideLoading(): void {
        // cc.log('=====hideLoading===');
        if (cc.isValid(AlertManager.loading)) {
            AlertManager.loading.getComponent('LoadingViewUI').hideLoading();
        }
    }

    public static isLoading(): boolean {
        return cc.isValid(AlertManager.loading) && AlertManager.loading.parent != null;
    }

    public static setLoadingCurrentCount(value: number): void {
        if (cc.isValid(AlertManager.loading)) {
            AlertManager.loading.getComponent('LoadingViewUI').currentCount = value;
        }
    }

    public static setLoadingTotalCount(value: number): void {
        if (cc.isValid(AlertManager.loading)) {
            AlertManager.loading.getComponent('LoadingViewUI').totalCount = value;
        }
    }

    public static setLoadingStr(value: number) {
        if (cc.isValid(AlertManager.loading)) {
            AlertManager.loading.getComponent('LoadingViewUI').progressStr = value;
        }
    }

    public static showTips(str: string, showTime?: number, posY?: number) {
        if (!AlertManager.tips || !AlertManager.tips.parent) {
            AlertManager.tips = cc.instantiate(cc.loader.getRes('prefabs/TipsViewUI'));
            AlertManager.tips.zIndex = 9983;
            let rootNode: any = AlertManager.getRootNode();
            rootNode.addChild(AlertManager.tips);
        }
        AlertManager.tips.getComponent('TipsViewUI').show(str, showTime, posY);
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
        AudioManager.playSFX(GlobalParams.btn_sound);
        Utils.nativeVibrate(shake.light);

        if (!cc.isValid(AlertManager.alert)) {
            AlertManager.createAlert();
        }
        if (AlertManager.alert.parent) {
            AlertManager.alert.removeFromParent(false);
        }
        if (!cc.isValid(AlertManager.mask)) {
            AlertManager.createMask();
        }
        if (AlertManager.mask.parent) {
            AlertManager.mask.removeFromParent(false);
        }
        let rootNode: any = AlertManager.getRootNode();
        let newConfirmCallBack = (): void => {
            AlertManager.mask.removeFromParent(false);
            this.topUIChange('');
            if (confirmCallBack) {
                confirmCallBack();
            }
        };
        let newCancelCallBack = (): void => {
            AlertManager.mask.removeFromParent(false);
            this.topUIChange('');
            if (cancelCallBack) {
                cancelCallBack();
            }
        };
        let maskConfirm = (): void => {
            AlertManager.alert.getComponent('AlertViewUI').confirmFun();
        };
        let maskCancel = (): void => {
            AlertManager.alert.getComponent('AlertViewUI').cancelFun();
        };
        AlertManager.mask.getComponent('MaskUI').setCancelCallback(swapCallBack ? maskConfirm : maskCancel);
        AlertManager.alert.getComponent('AlertViewUI').show(title, content, newConfirmCallBack, newCancelCallBack, showCancel, confirmStr, cancelStr);
        rootNode.addChild(AlertManager.mask);
        rootNode.addChild(AlertManager.alert);
        this.topUIChange('AlertViewUI');
    }

    public static hideAlert(): boolean {
        if (cc.isValid(AlertManager.alert) && AlertManager.alert.parent != null) {
            AlertManager.alert.getComponent('AlertViewUI').hide();
            return true;
        }
        return false;
    }

    public static showModule(moduleName: string): void {
        let mediator: any = AppFacade.getMediator(moduleName);
        if (mediator != null) {
            if (mediator.getModuleView() != null) {
                AlertManager.removeModule(moduleName);
            }
            let rootNode: any = AlertManager.getRootNode();
            let newUI: any = mediator.addModuleToScene(rootNode);
            AlertManager.uiMap.push({ moduleName: moduleName, ui: newUI });
        } else {
            cc.log('showModule......mediator..null....' + moduleName);
        }
    }

    public static removeModule(moduleName: string): void {
        cc.log('====removeModule===', moduleName);
        let moduleUI: any = AlertManager.getModuleUI(moduleName);
        if (moduleUI != null) {
            AlertManager.destroyModuleUI(moduleUI);
            AlertManager.removeMoudleUI(moduleName);
        }
    }

    public static destroyModuleUI(moduleUI: any): void {
        let mediator: any = AppFacade.getMediator(moduleUI.getModuleName());
        mediator.removeModule();
    }

    public static hasModule(moduleName: string): boolean {
        return AlertManager.getModuleUI(moduleName) != null;
    }

    public static getModuleUI(moduleName: string): any {
        for (let i: number = 0; i < AlertManager.uiMap.length; i++) {
            if (AlertManager.uiMap[i].moduleName == moduleName) {
                return AlertManager.uiMap[i].ui;
            }
        }
        return null;
    }

    public static removeMoudleUI(moduleName: string): void {
        for (let i: number = AlertManager.uiMap.length - 1; i >= 0; i--) {
            if (AlertManager.uiMap[i].moduleName == moduleName) {
                AlertManager.uiMap.splice(i, 1);
                break;
            }
        }
    }

    public static removeAllModules(): void {
        while (AlertManager.uiMap.length > 0) {
            AlertManager.destroyModuleUI(AlertManager.uiMap.pop().ui);
        }
    }

    public static topUIChange(uiName: string): void {
        for (let i: number = 0; i < AlertManager.uiMap.length; i++) {
            AlertManager.uiMap[i].ui.dispatcher.emit(ModuleEventType.MODULE_TOP_UI_CHANGE, uiName);
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
