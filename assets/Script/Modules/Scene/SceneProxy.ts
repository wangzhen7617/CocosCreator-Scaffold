
import { _decorator, Component, Node, director, log, sys } from 'cc';
import { GlobalParams } from '../../Core/Data/GlobalParams';
import { NotifyEventType } from '../../Core/Data/NotifyEventType';
import { UIMgr } from '../../Core/Mgr/UIMgr';
import { Proxy } from '../../Core/MVC/Proxy';
const { ccclass, property } = _decorator;

/**
 * 
 * github = https://github.com/wangzhen7617/CocosCreator-Scaffold
 * 
 * Predefined variables
 * DateTime = Mon Nov 22 2021 19:42:00 GMT+0800 (中国标准时间)
 * Author = <wangzhen7617>
 * FileBasename = SceneProxy.ts
 * FileBasenameNoExtension = SceneProxy
 * URL = db://assets/Script/Modules/Scene/SceneProxy.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/zh/
 *
 */

@ccclass('SceneProxy')
export class SceneProxy extends Proxy {
    constructor() {
        super();
    }

    protected addEvent(): void {
        this.addNotification(NotifyEventType.SCENE_SWITCH_SCENE, this.onSwitchScene);
    }

    private onSwitchScene = (data: any): void => {
        log('currentSceneName.......', GlobalParams.currentSceneName);
        let pSceneName: any = data;
        if (GlobalParams.currentSceneName == pSceneName) return;
        GlobalParams.currentSceneName = pSceneName;
        //TODO
        //  this.getProxy(ModuleType.NETWORK).startClientPing(); 心跳相关

        UIMgr.showLoading("加载场景中");
        UIMgr.removeAllModules();

        if (sys.isNative) {
            sys.garbageCollect();
        }
        log('load new scene .......' + pSceneName);
        director.loadScene(pSceneName);
    };
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
