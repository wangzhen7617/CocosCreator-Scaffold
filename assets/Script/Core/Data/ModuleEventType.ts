
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 
 * github = https://github.com/wangzhen7617/CocosCreator-Scaffold
 * 
 * Predefined variables
 * DateTime = Mon Nov 22 2021 17:02:26 GMT+0800 (中国标准时间)
 * Author = <wangzhen7617>
 * FileBasename = ModuleEventType.ts
 * FileBasenameNoExtension = ModuleEventType
 * URL = db://assets/Script/Core/Data/ModuleEventType.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/zh/
 *
 */

@ccclass('ModuleEventType')
export class ModuleEventType extends Component {
	static RETURN_TO_OLD_UI: string = 'COMMON_RETURN_TO_OLD_UI';
	static MODULE_UI_EMPTY: string = 'COMMON_MODULE_UI_EMPTY';
	static MODULE_PUSH_VIEW: string = 'COMMON_MODULE_PUSH_VIEW';
	static MODULE_JUMP_VIEW: string = 'COMMON_MODULE_JUMP_VIEW';
	static MODULE_PUSH_COMPLETE: string = 'MODULE_PUSH_COMPLETE';
	static MODULE_POP_COMPLETE: string = 'MODULE_POP_COMPLETE';
	static MODULE_TOP_UI_CHANGE: string = 'MODULE_TOP_UI_CHANGE';
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
