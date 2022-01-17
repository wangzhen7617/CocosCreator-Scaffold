
import { _decorator, Component, Node, game, Game } from 'cc';
import { NotifyEventType } from '../../core/data/NotifyEventType';
import { AssetsMgr } from '../../core/mgr/AssetsMgr';
import { HotUpdateVO } from './vo/HotUpdateVO';
const { ccclass, property } = _decorator;
import { Proxy } from '../../core/puremvc/Proxy';
import { Logger } from '../../core/utils/Logger';
import { SceneType } from '../scene/data/SceneType';

/**
 * 
 * github = https://github.com/wangzhen7617/CocosCreator-Scaffold
 * 
 * Predefined variables
 * DateTime = Mon Nov 22 2021 19:34:07 GMT+0800 (中国标准时间)
 * Author = <wangzhen7617>
 * FileBasename = HotupdateProxy.ts
 * FileBasenameNoExtension = HotupdateProxy
 * URL = db://assets/Script/Modules/Hotupdate/HotupdateProxy.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/zh/
 *
 */

@ccclass('HotUpdateProxy')
export class HotUpdateProxy extends Proxy {
    vo: HotUpdateVO;

    constructor() {
        super();
        this.vo = new HotUpdateVO();
    }

    protected addEvent(): void {
        game.on(Game.EVENT_HIDE, this.onGameHide, this);
        game.on(Game.EVENT_SHOW, this.onGameShow, this);

        this.addNotification(NotifyEventType.HOT_UPDATE_SWITCH_NEXT, this.switchGame)
    }

    private onGameHide(): void {
        Logger.log("onGameHide");
    }


    private onGameShow(): void {
        Logger.log("onGameShow");
    }

    private switchGame() {
        AssetsMgr.loadScene(
            SceneType.Login,
            false,
            () => {
                this.sendNotification(NotifyEventType.SCENE_SWITCH_SCENE, SceneType.Login);
            },
            false
        );
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
