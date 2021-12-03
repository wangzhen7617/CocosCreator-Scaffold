
import { _decorator, Component, Node, SpriteFrame, Sprite } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 
 * github = https://github.com/wangzhen7617/CocosCreator-Scaffold
 * 
 * Predefined variables
 * DateTime = Fri Dec 03 2021 13:38:05 GMT+0800 (中国标准时间)
 * Author = <wangzhen7617>
 * FileBasename = Hexagon.ts
 * FileBasenameNoExtension = Hexagon
 * URL = db://assets/resources/Prefabs/Hexagon.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/zh/
 *
 */

@ccclass('Hexagon')
export class Hexagon extends Component {
    @property([SpriteFrame])
    hexSpriteFrame: SpriteFrame[] = [];

    @property([SpriteFrame])
    boomFrame: SpriteFrame[] = [];

    indexColor: number = null;
    row: number = null;
    col: number = null;
    select: boolean = false;
    count: number = null;

    eventSelect: boolean = false


    start() {

    }

    init(i: number, j: number, index: number) {
        this.indexColor = index;
        this.row = i;
        this.col = j;
        this.select = false;
        this.count = 0;
    }

    setSprite(index: number) {
        this.getComponent(Sprite).spriteFrame = this.hexSpriteFrame[index]
    }

    setBomb(index: number) {
        this.getComponent(Sprite).spriteFrame = this.boomFrame[index]
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
