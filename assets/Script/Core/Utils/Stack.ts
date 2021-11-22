
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 
 * github = https://github.com/wangzhen7617/CocosCreator-Scaffold
 * 
 * Predefined variables
 * DateTime = Mon Nov 22 2021 17:10:49 GMT+0800 (中国标准时间)
 * Author = <wangzhen7617>
 * FileBasename = Stack.ts
 * FileBasenameNoExtension = Stack
 * URL = db://assets/Script/Core/Utils/Stack.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/zh/
 *
 */

@ccclass('Stack')
export class Stack extends Component {

    private elements: Array<any> = [];

    public push = (ele: any): number => {
        this.elements.push(ele);
        return this.elements.length;
    };

    public pop = (): any => {
        if (this.elements.length <= 0) {
            return null;
        }
        return this.elements.pop();
    };

    public top = (): any => {
        if (this.elements.length <= 0) {
            return null;
        }
        return this.elements[this.elements.length - 1];
    };

    public size = (): number => {
        return this.elements.length;
    };

    public isEmpty = (): boolean => {
        if (this.elements.length > 0) {
            return false;
        } else {
            return true;
        }
    };

    public remove = (value: any): boolean => {
        for (let i: number = 0; i < this.elements.length; i++) {
            if (this.elements[i] == value) {
                this.elements.splice(i, 1);
                return true;
            }
        }
        return false;
    };

    public clear = (): void => {
        this.elements = [];
    };
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
