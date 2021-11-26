
import { _decorator, Component, Node, view, log } from 'cc';
import { BaseInterface } from '../../../Core/Base/BaseInterface';
import { BaseScene } from '../../../Core/Base/BaseScene';
import { GlobalParams } from '../../../Core/Data/GlobalParams';
import { ModuleType } from '../../../Core/Data/ModuleType';
import { AssetsMgr } from '../../../Core/Mgr/AssetsMgr';
import { UIMgr } from '../../../Core/Mgr/UIMgr';
import { AppFacade } from '../../../Core/MVC/AppFacade';
import { HotUpdateMediator } from '../../Hotupdate/HotUpdateMediator';
import { HotUpdateProxy } from '../../Hotupdate/HotUpdateProxy';
import { LoginMediator } from '../../Login/LoginMediator';
import { LoginProxy } from '../../Login/LoginProxy';
import { SceneType } from '../Data/SceneType';
import { SceneProxy } from '../SceneProxy';
const { ccclass, property } = _decorator;

/**
 * 
 * github = https://github.com/wangzhen7617/CocosCreator-Scaffold
 * 
 * Predefined variables
 * DateTime = Mon Nov 22 2021 19:53:05 GMT+0800 (中国标准时间)
 * Author = <wangzhen7617>
 * FileBasename = StartScene.ts
 * FileBasenameNoExtension = StartScene
 * URL = db://assets/Script/Modules/Scene/View/StartScene.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/zh/
 *
 */

@ccclass('StartScene')
export class StartScene extends BaseScene {


    start() {
        // cc.macro.CLEANUP_IMAGE_CACHE = true

        GlobalParams.screenFitAll = (view.getCanvasSize().width / view.getCanvasSize().height) > (16 / 9);
        // if(cc.sys.isBrowser)
        //     GlobalParams.screenFitAll = true;

        GlobalParams.currentSceneName = SceneType.Start;

        AppFacade.getInstance().removeAll();
        AppFacade.getInstance().registerProxy(ModuleType.SCENE, new SceneProxy());
        AppFacade.getInstance().registerProxy(ModuleType.HOT_UPDATE, new HotUpdateProxy());
        AppFacade.getInstance().registerMediator(ModuleType.HOT_UPDATE, new HotUpdateMediator());
        AppFacade.getInstance().registerProxy(ModuleType.LOGIN, new LoginProxy())
        AppFacade.getInstance().registerMediator(ModuleType.LOGIN, new LoginMediator())


        // AppFacade.getInstance().registerProxy(ModuleType.SOCKET, new SocketProxy());
        // AppFacade.getInstance().registerProxy(ModuleType.NETWORK, new NetworkProxy());
        // AppFacade.getInstance().registerProxy(ModuleType.RECONNECT, new ReconnectProxy());
        // AppFacade.getInstance().registerMediator(ModuleType.RECONNECT, new ReconnectMediator());
        AssetsMgr.init(this.assetsComplete);
        super.start();
    }

    private assetsComplete = (): void => {
        // AlertManager.showLoading('正在下载资源');
        // PBBuild.init();
        // AudioManager.init();
        UIMgr.showModule(ModuleType.HOT_UPDATE);
    };

    protected initView() {
        log("Start Scene init View");
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
