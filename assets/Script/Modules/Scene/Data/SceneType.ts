
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 
 * github = https://github.com/wangzhen7617/CocosCreator-Scaffold
 * 
 * Predefined variables
 * DateTime = Mon Nov 22 2021 19:48:31 GMT+0800 (中国标准时间)
 * Author = <wangzhen7617>
 * FileBasename = SceneType.ts
 * FileBasenameNoExtension = SceneType
 * URL = db://assets/Script/Modules/Scene/Data/SceneType.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/zh/
 *
 */

@ccclass('SceneType')
export class SceneType extends Component {
    public static Start: string = "Start";
    public static Login: string = "Login";
    public static Battle: string = 'Battle'
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
