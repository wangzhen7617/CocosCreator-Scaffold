
import { _decorator, Component, Node } from 'cc';
import { Mediator } from '../../Core/MVC/Mediator';
import { BattleModule } from './BattleModule';
const { ccclass, property } = _decorator;

/**
 * 
 * github = https://github.com/wangzhen7617/CocosCreator-Scaffold
 * 
 * Predefined variables
 * DateTime = Fri Dec 03 2021 14:38:35 GMT+0800 (中国标准时间)
 * Author = <wangzhen7617>
 * FileBasename = BattleMediator.ts
 * FileBasenameNoExtension = BattleMediator
 * URL = db://assets/Script/Modules/Battle/BattleMediator.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/zh/
 *
 */
 
@ccclass('BattleMediator')
export class BattleMediator extends Mediator {

    protected addEvent(): void {

    }

    protected addModuleEvent(): void {
        super.addModuleEvent();
    }

    protected removeModuleEvent(): void {
        super.removeModuleEvent();
    }
    public getNewUI(): any {
        return new BattleModule();
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
