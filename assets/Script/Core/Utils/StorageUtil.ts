
import { _decorator, Component, Node, sys } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 
 * github = https://github.com/wangzhen7617/CocosCreator-Scaffold
 * 
 * Predefined variables
 * DateTime = Mon Nov 22 2021 17:23:47 GMT+0800 (中国标准时间)
 * Author = <wangzhen7617>
 * FileBasename = StorageUtil.ts
 * FileBasenameNoExtension = StorageUtil
 * URL = db://assets/Script/Core/Utils/StorageUtil.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/zh/
 *
 */

@ccclass('StorageUtil')
export class StorageUtil extends Component {

    public static save(key: string, value: any = null) {
        sys.localStorage.setItem(key, value)
    }


    public static read(key: string) {
        return sys.localStorage.getItem(key);
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
