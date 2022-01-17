
import { _decorator, Component, Node } from 'cc';
import { BaseScene } from '../../../core/base/BaseScene';
import { ModuleType } from '../../../core/data/ModuleType';
import { UIMgr } from '../../../core/mgr/UIMgr';
import { Facade } from '../../../core/puremvc/Facade';
import { BattleMediator } from '../../battle/BattleMediator';
import { BattleProxy } from '../../battle/BattleProxy';

const { ccclass, property } = _decorator;

/**
 * 
 * github = https://github.com/wangzhen7617/CocosCreator-Scaffold
 * 
 * Predefined variables
 * DateTime = Fri Dec 03 2021 14:36:02 GMT+0800 (中国标准时间)
 * Author = <wangzhen7617>
 * FileBasename = BattleScene.ts
 * FileBasenameNoExtension = BattleScene
 * URL = db://assets/Script/Modules/Scene/View/BattleScene.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/zh/
 *
 */

@ccclass('BattleScene')
export class BattleScene extends BaseScene {

    start() {
        super.start()
        Facade.getInstance().registerProxy(ModuleType.Battle, new BattleProxy())
        Facade.getInstance().registerMediator(ModuleType.Battle, new BattleMediator())
        
        UIMgr.showModule(ModuleType.Battle);
        // AssetsManager.reloadModule(SubGameType.HALL, false, () => {
        // })
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
