
import { _decorator } from 'cc';
import { BaseScene } from '../../../core/base/BaseScene';
import { GlobalParams } from '../../../core/data/GlobalParams';
import { ModuleType } from '../../../core/data/ModuleType';
import { AssetsMgr } from '../../../core/mgr/AssetsMgr';
import { UIMgr } from '../../../core/mgr/UIMgr';
import { Facade } from '../../../core/puremvc/Facade';
import { Logger } from '../../../core/utils/Logger';
import { HotUpdateMediator } from '../../hotupdate/HotUpdateMediator';
import { HotUpdateProxy } from '../../hotupdate/HotUpdateProxy';
import { NetworkProxy } from '../../network/NetworkProxy';
import { SceneProxy } from '../SceneProxy';
import { SceneType } from '../data/SceneType';
import { JsonUtil } from '../../../core/utils/JsonUtil';
import { config } from '../../../core/data/Config';

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

        super.start();

        GlobalParams.sceneName = SceneType.Start;

        Facade.getInstance().removeAll();
        Facade.getInstance().registerProxy(ModuleType.SCENE, new SceneProxy());
        Facade.getInstance().registerProxy(ModuleType.HOT_UPDATE, new HotUpdateProxy());
        Facade.getInstance().registerMediator(ModuleType.HOT_UPDATE, new HotUpdateMediator());


        Facade.getInstance().registerProxy(ModuleType.NETWORK, new NetworkProxy());


        // Facade.getInstance().registerProxy(ModuleType.RECONNECT, new ReconnectProxy());
        // Facade.getInstance().registerMediator(ModuleType.RECONNECT, new ReconnectMediator());


        JsonUtil.load("cfg", this.jsonComplete)
    }

    jsonComplete(json: any) {
        config.init(json)
        Logger.log(config.gameConfig, config.sceneConfig)
        // PBBuild.init();
        // AudioManager.init();

        AssetsMgr.loadScene(
            SceneType.Start,
            false,
            () => {
                UIMgr.showModule(ModuleType.HOT_UPDATE);
                // UIMgr.showLoading('正在下载资源');
            },
            false, false
        );
    }
    protected initView() { }
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
