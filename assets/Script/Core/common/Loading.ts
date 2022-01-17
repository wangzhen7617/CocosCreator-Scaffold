
import { _decorator, Component, Node, Label, UITransform, UIOpacity } from 'cc';
import { UIMgr } from '../mgr/UIMgr';
import { Logger } from '../utils/Logger';
const { ccclass, property } = _decorator;

/**
 * 
 * github = https://github.com/wangzhen7617/CocosCreator-Scaffold
 * 
 * Predefined variables
 * DateTime = Fri Jan 14 2022 14:34:22 GMT+0800 (中国标准时间)
 * Author = <wangzhen7617>
 * FileBasename = Loading.ts
 * FileBasenameNoExtension = Loading
 * URL = db://assets/script/core/common/Loading.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/zh/
 *
 */

@ccclass('Loading')
export class Loading extends Component {

    @property(Label)
    labelDescTxt: Label = null;
    @property(Node)
    loading: Node = null;

    private timerCount: number = 0;
    private totalCount: number = 0;
    private callbackFun: (this: void) => void;
    public static TIME_MAX_SHOW_COUNT = 20;
    public static errorStr: string = "";
    public static b_hideCount: boolean = false;

    loading_rotate = 0

    start() {
    }

    onEnable(): void {

    }

    public showLoading = (progressStr: string, hideLoad: boolean, totalCount: number, callback?: (this: void) => void): void => {
        Logger.log("show loading")
        this.loading.active = true;
        this.labelDescTxt.string = progressStr;
        this.timerCount = 0;
        this.totalCount = totalCount;
        this.callbackFun = callback
        if (hideLoad) {
            this.node.getComponent(UIOpacity).opacity = 0;
        } else {
            this.node.getComponent(UIOpacity).opacity = 255;
        }
        this.unschedule(this.doLoadingCount);
        // this.doLoadingCount()
        this.schedule(this.doLoadingCount, 1);
    }

    public hideLoading = (): void => {
        Logger.log("hide loading")
        this.labelDescTxt.string = '';
        this.callbackFun = null;
        this.node.removeFromParent();
        this.unschedule(this.doLoadingCount);
    }

    private doLoadingCount(): void {
        Logger.log("this.timecount", this.timerCount)
        this.timerCount += 1;
        if (this.timerCount >= this.totalCount) {
            this.unschedule(this.doLoadingCount);
            if (this.callbackFun) {
                this.callbackFun();
            }
            this.hideLoading();
        }
    }


    update(dt: number) {
        this.loading_rotate += dt * 220;
        this.loading!.setRotationFromEuler(0, 0, -this.loading_rotate % 360)
        if (this.loading_rotate > 360) {
            this.loading_rotate -= 360;
        }
    }
}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.4/manual/zh/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.4/manual/zh/scripting/ccclass.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.4/manual/zh/scripting/life-cycle-callbacks.html
 */
