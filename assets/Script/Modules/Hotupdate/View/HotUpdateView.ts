
import { _decorator, Component, Node, sys, JsonAsset, AssetManager } from 'cc';
import { BUILD, JSB } from 'cc/env';
import { BaseView } from '../../../Core/Base/BaseView';
import { GameType } from '../../../Core/Data/GameType';
import { GlobalParams } from '../../../Core/Data/GlobalParams';
import { AssetsMgr } from '../../../Core/Mgr/AssetsMgr';
import { UIMgr } from '../../../Core/Mgr/UIMgr';
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

        let json: any = this.cfgJson.json;
        let localGameInfo: any = {}
        for (let i: number = 0; i < json.Game.length; i++) {
            let gameInfo: any = json.Game[i];
            let pkgName: string = gameInfo.packageName;
            localGameInfo[pkgName].isLoaded = false;
        }
        GlobalParams.localGameInfo = localGameInfo;
        AssetsMgr.loadGame(GameType.Start, false, this.onLoadCallback, false);
    }

    onLoadCallback() {
        UIMgr.showModule(GameType.Start);
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
