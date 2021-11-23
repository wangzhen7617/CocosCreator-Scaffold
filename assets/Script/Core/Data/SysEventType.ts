
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 
 * github = https://github.com/wangzhen7617/CocosCreator-Scaffold
 * 
 * Predefined variables
 * DateTime = Tue Nov 23 2021 19:13:52 GMT+0800 (中国标准时间)
 * Author = <wangzhen7617>
 * FileBasename = SysEventType.ts
 * FileBasenameNoExtension = SysEventType
 * URL = db://assets/Script/Core/Data/SysEventType.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/zh/
 *
 */

@ccclass('SysEventType')
export class SysEventType extends Component {
    static CLICK: string = 'click';
    static TOUCH_START: string = 'touchstart';
    static TOGGLE: string = 'toggle';
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
