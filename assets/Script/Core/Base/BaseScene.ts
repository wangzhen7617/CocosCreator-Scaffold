
import { _decorator, Component, Node, Canvas, log } from 'cc';
import { BaseInterface } from './BaseInterface';
const { ccclass, property } = _decorator;

/**
 * 
 * github = https://github.com/wangzhen7617/CocosCreator-Scaffold
 * 
 * Predefined variables
 * DateTime = Mon Nov 22 2021 20:23:49 GMT+0800 (中国标准时间)
 * Author = <wangzhen7617>
 * FileBasename = BaseScene.ts
 * FileBasenameNoExtension = BaseScene
 * URL = db://assets/Script/Core/Base/BaseScene.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/zh/
 *
 */

@ccclass('BaseScene')
export class BaseScene extends Component {

    protected start() {

        log("run scene " + this.name)
        this.initView();
        this.addEvent();
        this.customInit();
    }

    protected onDestroy(): void {
        this.removeEvent();
        this.customDestroy();
    }

    protected initView(): void { }
    protected addEvent(): void { }
    protected removeEvent(): void { }
    protected customInit(): void { }
    protected customDestroy(): void { }

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
