
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 
 * github = https://github.com/wangzhen7617/CocosCreator-Scaffold
 * 
 * Predefined variables
 * DateTime = Wed Dec 01 2021 17:08:01 GMT+0800 (中国标准时间)
 * Author = <wangzhen7617>
 * FileBasename = CustomComponent.ts
 * FileBasenameNoExtension = CustomComponent
 * URL = db://assets/resources/Prefabs/CustomComponent.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/zh/
 *
 */

@ccclass('Cell')
export class Cell extends Component {

    private selected = false

    start() {
    }


    isSelected() {
        return this.selected
    }

    select(sel: boolean) {
        this.selected = sel
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
