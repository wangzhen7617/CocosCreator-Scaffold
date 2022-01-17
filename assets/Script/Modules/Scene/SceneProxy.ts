
import { _decorator, Component, Node, director, sys } from 'cc';
import { GlobalParams } from '../../core/data/GlobalParams';
import { NotifyEventType } from '../../core/data/NotifyEventType';
import { UIMgr } from '../../core/mgr/UIMgr';
import { DispatcherEvent } from '../../core/puremvc/DispatcherEvent';
import { Proxy } from '../../core/puremvc/Proxy';
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

    private onSwitchScene = (event: DispatcherEvent): void => {
        let pSceneName: any = event.detail;
        if (GlobalParams.sceneName == pSceneName) return;
        GlobalParams.sceneName = pSceneName;

        // UIMgr.showLoading("加载场景中");
        UIMgr.removeAllModules();

        if (sys.isNative) {
            sys.garbageCollect();
        }
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
