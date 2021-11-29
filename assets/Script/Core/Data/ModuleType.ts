
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 
 * github = https://github.com/wangzhen7617/CocosCreator-Scaffold
 * 
 * Predefined variables
 * DateTime = Mon Nov 22 2021 17:41:57 GMT+0800 (中国标准时间)
 * Author = <wangzhen7617>
 * FileBasename = ModuleType.ts
 * FileBasenameNoExtension = ModuleType
 * URL = db://assets/Script/Core/Data/ModuleType.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/zh/
 *
 */

@ccclass('ModuleType')
export class ModuleType extends Component {
    static HOT_UPDATE: string = 'HotUpdate';
    static LOGIN: string = 'Login';
    static NETWORK: string = 'Network';
    static SOCKET: string = 'Socket';
    static MAIN: string = 'Main';
    static ROOM: string = 'Room';
    static SCENE: string = 'Scene';
    static RECONNECT: string = 'Reconnect';
    static Battle: string = 'Battle';
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
