
import { _decorator, Component, Node, sys, JsonAsset } from 'cc';
import { BUILD, JSB } from 'cc/env';
import { BaseView } from '../../../Core/Base/BaseView';
import { GlobalParams } from '../../../Core/Data/GlobalParams';
const { ccclass, property } = _decorator;

/**
 * 
 * github = https://github.com/wangzhen7617/CocosCreator-Scaffold
 * 
 * Predefined variables
 * DateTime = Tue Nov 23 2021 19:06:32 GMT+0800 (中国标准时间)
 * Author = <wangzhen7617>
 * FileBasename = HotUpdateView.ts
 * FileBasenameNoExtension = HotUpdateView
 * URL = db://assets/Script/Modules/Hotupdate/View/HotUpdateView.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/zh/
 *
 */

@ccclass('HotUpdateView')
export class HotUpdateView extends BaseView {

    @property(JsonAsset)
    cfgJson: JsonAsset = null;

    start() {
        super.start();
    }

    protected initView(): void {
        // Hot update is only available in Native build
        if (sys.isNative && JSB && BUILD) {
            this.initHotUpdate()
        } else {
            this.runGame();
        }
    }

    protected addEvent(): void { }

    protected removeEvent(): void { }

    protected onDestroy(): void { }
    private initHotUpdate(): void {

    }

    private runGame() {

        let json = this.cfgJson.json;

        let localGameInfo: any = Utils.getLocalItemValue(LocalItems.LOCAL_GAME_INFO);
        if (!localGameInfo) localGameInfo = {};
        else localGameInfo = JSON.parse(localGameInfo);
        for (let i: number = 0; i < ret.GameList.length; i++) {
            let gameInfo: any = ret.GameList[i];
            let pkgName: string = gameInfo.packageName;
            GlobalParams.subGameInfo[pkgName] = Utils.deepCopy(gameInfo);
            if (!localGameInfo[pkgName]) {
                localGameInfo[pkgName] = Utils.deepCopy(gameInfo);
                localGameInfo[pkgName].version = '1.0.00';
            }
            //模块的资源是否已经加载到内存里，刚打开游戏的时候都是false
            localGameInfo[pkgName].isLoaded = false;
        }
        GlobalParams.localGameInfo = localGameInfo;
        AssetsManager.reloadModule(SubGameType.LOGIN, false, this.prefabCompleteCallback, false);
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
