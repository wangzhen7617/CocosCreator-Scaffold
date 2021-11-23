
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 
 * github = https://github.com/wangzhen7617/CocosCreator-Scaffold
 * 
 * Predefined variables
 * DateTime = Tue Nov 23 2021 12:02:28 GMT+0800 (中国标准时间)
 * Author = <wangzhen7617>
 * FileBasename = BaseInterface.ts
 * FileBasenameNoExtension = BaseInterface
 * URL = db://assets/Script/Core/Base/BaseInterface.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/zh/
 *
 */

// @ccclass('BaseInterface')
// export class BaseInterface extends Component {

//     start () {
//     }

// }

export interface BaseInterface {
    initView(): void
    addEvent(): void
    removeEvent(): void
    customInit(): void
    customDestroy(): void
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
