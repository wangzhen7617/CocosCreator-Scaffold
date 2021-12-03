
import { _decorator, Component, Node, log, Prefab, instantiate, Vec3, EventTouch, Tween, tween, easing, warn, Animation, UITransform, Vec2 } from 'cc';
import { Hexagon } from '../../../../resources/Prefabs/Hexagon';
import { BaseModule } from '../../../Core/Base/BaseModule';
import { SysEventType } from '../../../Core/Data/SysEventType';
const { ccclass, property } = _decorator;

/**
 * 
 * github = https://github.com/wangzhen7617/CocosCreator-Scaffold
 * 
 * Predefined variables
 * DateTime = Fri Dec 03 2021 12:12:54 GMT+0800 (中国标准时间)
 * Author = <wangzhen7617>
 * FileBasename = BattleViewUI.ts
 * FileBasenameNoExtension = BattleViewUI
 * URL = db://assets/Script/Modules/Battle/View/BattleViewUI.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/zh/
 *
 */

interface HexPosition {
    i: number
    j: number
}

@ccclass('BattleViewUI')
export class BattleViewUI extends BaseModule {
    totalArray: any[] = []//方块总数
    totalPosition: any[] = []//存放每个方块的位置
    selectArray: Hexagon[] = []//选中方块数组
    deleteArray: any[] = []//删除的方块数组

    colNum: any = {};//删除元素的每列个数
    isHold: boolean = false;//是否按下
    canTouch: boolean = true //是否响应触摸
    starHeight: number = 96; //六边形排列高
    starWidth: number = 104//六边形排列宽
    hexSide: number = 4;//每边四个
    bombNumber: number = 0;//炸弹数量
    gameEnded: boolean = false

    colorArray: string[] = new Array('5', '1', '2', '3', '4'); //颜色数组

    selectHasBomb: Node[] = [];

    @property(Prefab)
    hexagon: Prefab = null;

    @property(Prefab)
    line: Prefab = null;
    @property(Prefab)
    explosion: Prefab = null;
    @property(Prefab)
    boom: Prefab = null;
    @property(Node)
    hexgroup: Node = null;

    @property(Node)
    linegroup: Node = null;

    @property(Node)
    explosionGroup: Node = null;
    @property(Node)
    boomgroup: Node = null;





    start() {
        super.start()
    }

    protected initView() {
        this.loadHexagon()

    }

    protected addEvent() {
        this.node.getChildByPath('Canvas/Background').on(Node.EventType.MOUSE_DOWN, () => {
            warn(
                "啊啊啊啊啊啊啊啊啊啊"
            )
        }, this)
        this.node.getChildByPath('Canvas/Background').on(Node.EventType.MOUSE_UP, this.onStartMouseUp, this)
    }

    loadHexagon() {
        this.hexSide--;
        for (let i = -this.hexSide; i <= this.hexSide; i++) {
            for (let j = -this.hexSide; j <= this.hexSide; j++) {
                if (i * j > 0 && Math.abs(i + j) > this.hexSide) continue;
                if (i * j < 0 && (Math.abs(i) > this.hexSide || Math.abs(j) > this.hexSide)) continue;
                log(i, j)


                let index = parseInt((Math.random() * this.colorArray.length - 1).toString());

                let node = instantiate(this.hexagon)
                node.parent = this.hexgroup;
                if (Math.random() > 0.9) {
                    node.getComponent(Hexagon).setBomb(index)
                    node.name = 'bomb'
                } else {
                    node.getComponent(Hexagon).setSprite(index)
                    node.name = "lbx";
                }
                node.getComponent(Hexagon).init(i, j, index)
                const pos = this.hex2pixel({ i, j }, this.starWidth)
                node.setPosition(pos)
                const HexPos = {
                    x: pos.x,
                    y: pos.y,
                    isExist: true
                }
                this.totalPosition.push(HexPos);
                this.totalArray.push(node);
                node['test'] = i + "-" + j
                // node.on(Node.EventType.MOUSE_DOWN, this.onMouseDown, this);
                // node.on(Node.EventType.MOUSE_ENTER, this.onMouseEnter, this);
                // node.on(Node.EventType.MOUSE_LEAVE, this.onMouseLeave, this);

                node.on(Node.EventType.TOUCH_START, this.onTouchStart, this)
                node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this)

            }
        }
    }

    private onTouchStart(event: EventTouch) {
        let node = event.target as Node
        if (this.gameEnded) {
            return;
        }
        if (!this.canTouch) {
            return
        }
        this.selectHasBomb = [];
        if (node.name != 'lbx') {
            this.selectHasBomb.push(node)
        }
        tween(node).to(0.1, { scale: new Vec3(1.1, 1.1) }, { easing: "bounceOut" }).start()
        this.isHold = true;
        this.selectArray.push(node.getComponent(Hexagon));//消灭方块数组
        node.getComponent(Hexagon).select = true;
        node.getComponent(Hexagon).eventSelect = true;

        // Laya.SoundManager.playSound("sound/select.mp3", 1, new Laya.Handler(this, null));


    }

    private onTouchMove(event: EventTouch) {
        if (!this.isHold) {
            return
        }
        log(event)

        let node = event.target as Node;
        let _hexagon = node.getComponent(Hexagon)
        let convertPosition = this.node.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y))

        // log('move', node.getComponent(UITransform).getBoundingBox(), convertPosition)
        if (node.getComponent(UITransform).getBoundingBox().contains(new Vec2(convertPosition.x, convertPosition.y))) {
        } else {
            // 当前对象
            let curSelect = this.selectArray[this.selectArray.length - 1].getComponent(Hexagon);
            if (curSelect.eventSelect) {
                log("onMouseLeave")
                curSelect.eventSelect = false
                tween(node).to(0.1, { scale: Vec3.ONE }, { easing: "bounceOut" }).start()
            }


            // 检测周围
            for (let j = 0; j < this.totalArray.length; j++) {
                if (this.totalArray[j].getComponent(UITransform).getBoundingBox().contains(new Vec2(convertPosition.x, convertPosition.y))) {
                    this.onMouseEnter({ currentTarget: this.totalArray[j] })
                    break
                }
            }




        }

    }

    private onMouseEnter(event) {
        log('onMouseEnter', event.currentTarget['test'])
        if (!this.isHold) {
            return
        }
        if (this.gameEnded) {
            return;
        }
        let node = event.currentTarget as unknown as Node;
        let _hexagon = node.getComponent(Hexagon)

        if (this.selectArray[this.selectArray.length - 1].indexColor == _hexagon.indexColor) {
            if ((Math.abs(this.selectArray[this.selectArray.length - 1].row - _hexagon.row) == 1 && this.selectArray[this.selectArray.length - 1].col == _hexagon.col)
                || (this.selectArray[this.selectArray.length - 1].col - _hexagon.col == 1 && (this.selectArray[this.selectArray.length - 1].row - _hexagon.row == 0 || this.selectArray[this.selectArray.length - 1].row - _hexagon.row == -1))
                || (this.selectArray[this.selectArray.length - 1].col - _hexagon.col == -1 && (this.selectArray[this.selectArray.length - 1].row - _hexagon.row == 0 || this.selectArray[this.selectArray.length - 1].row - _hexagon.row == 1))) {

                tween(node).to(0.1, { scale: new Vec3(1.1, 1.1) }, { easing: "bounceOut" }).start()
                // Laya.SoundManager.playSound("sound/select.mp3", 1, new Laya.Handler(this, null));
                if (!_hexagon.select) {
                    this.drawLine(this.selectArray[this.selectArray.length - 1], _hexagon);
                    this.selectArray.push(_hexagon);//消灭方块数组
                    _hexagon.select = true;
                    _hexagon.eventSelect = true;
                    if (node.name != 'lbx') {
                        this.selectHasBomb.push(node);
                    }
                }
            }
        }

        if (this.selectArray.length > 2 && node == this.selectArray[this.selectArray.length - 2].node) {
            this.linegroup.children[this.linegroup.children.length - 1].destroy();
            this.selectArray[this.selectArray.length - 1].select = false;
            this.selectArray.pop();
            if (node.name != 'lbx') {
                this.selectHasBomb.pop()
            }
        }
        // this.node.getChildByPath('Canvas/Background').on(Node.EventType.MOUSE_UP, this.ClickOut, this)
    }




    /**
     * 六边形坐标转换成像素值
     * @param {*坐标} hex 
     * @param {*高度} h 
     */
    private hex2pixel(hex: HexPosition, height: number): Vec3 {
        let size = height / 2;
        let y = parseInt((size * Math.sqrt(3) * (hex.i + hex.j / 2)).toString());
        let x = ((size * 3) / 2) * hex.j;
        return new Vec3(x, y);
    }



    onStartMouseUp(event: MouseEvent) {
        // let DIV = document.getElementById("layaCanvas");
        // DIV.onmouseout = function () {
        //     console.log(1);
        // }

        let node = event.currentTarget;
        warn("1111111111111111111", this.isHold)
        if (this.isHold) {

            this.linegroup.destroy();
            this.isHold = false;

            tween(node).to(0.1, { scale: Vec3.ONE }, { easing: "bounceOut" }).start()

            if (this.selectArray.length >= 3) {
                if (this.selectHasBomb.length != 0) {
                    this.selectArray.forEach(item => {
                        // Laya.SoundManager.playSound("sound/boom.mp3", 1, new Laya.Handler(this, null));
                        this.DestoryAnimation(item)
                        this.BoomAnimation(item);
                        this.deleteArray.push(item);
                        let index = this.totalArray.indexOf(item);
                        if (index > -1) {
                            this.totalArray.splice(index, 1);
                        }
                    })
                    for (let i = 0; i < this.selectHasBomb.length; i++) {
                        // Laya.SoundManager.playSound("sound/boom.mp3", 1, new Laya.Handler(this, null));
                        this.bombProps(this.selectHasBomb[i])
                        this.bombExplosion(this.selectHasBomb[i]);
                    }
                    this.updateArray();
                } else {
                    this.selectArray.forEach(item => {
                        this.deleteArray.push(item);
                        this.DestoryAnimation(item)
                        this.BoomAnimation(item);
                        let index = this.totalArray.indexOf(item);
                        if (index > -1) {
                            this.totalArray.splice(index, 1);
                        }
                    })
                }
                // Laya.SoundManager.playSound("sound/clear.mp3", 1, new Laya.Handler(this, null));
                this.selectArray = [];
                this.canTouch = false;


                // Laya.timer.once(150, this, this.verticalFall, []);
            } else {
                this.selectArray.forEach(item => {
                    item.select = false;
                })
                this.selectHasBomb = [];
                this.selectArray = [];
            }
        }
    }


    /**
 * 划线
 * @param {*} start 
 * @param {*} end 
 */
    private drawLine(start: Hexagon, end: Hexagon) {
        let startPos = start.node.getPosition();
        let endPos = end.node.getPosition();
        let line = instantiate(this.line)
        this.linegroup.addChild(line);
        line.setPosition(new Vec3((startPos.x + endPos.x) / 2, (startPos.y + endPos.y) / 2))


        if (start.col == end.col) {
            // console.log("竖直")

        } else if ((start.col + start.row) == (end.col + end.row)) {
            // console.log("左斜")
            line.angle = 60;
        } else {
            // console.log("右斜")
            line.angle = 120;
        }
    }

    /**
     * 消失动画
     */
    DestoryAnimation(item: Hexagon) {
        tween(item.node).to(0.3, { scale: new Vec3(0.1, 0.1) }).call(() => {
            item.node.destroy()
        }).start()
    }

    /**
     * 炸弹爆炸动画
     */
    bombExplosion(item: Node) {
        let explosion = instantiate(this.explosion);
        explosion.parent = this.explosionGroup;
        explosion.position = item.position;
        explosion.getComponent(Animation).play();
        explosion.getComponent(Animation).on(Animation.EventType.FINISHED, () => {
            explosion.destroy();
        }, this)
    }


    /**
     * 星星爆炸动画
     */
    BoomAnimation(item: Hexagon) {
        let boom = instantiate(this.boom);
        boom.parent = this.boomgroup;
        boom.position = item.node.position;
        boom.getComponent(Animation).play();
        boom.getComponent(Animation).on(Animation.EventType.FINISHED, () => {
            boom.destroy();
        }, this)
    }

    /**
     * 炸弹道具逻辑
     */
    bombProps(node: Node) {
        // console.log('total' + this.totalArray.length)
        // console.log(this.deleteArray.length)
        let _hexagon = node.getComponent(Hexagon)

        this.updateArray();
        for (let j = 0; j < this.totalArray.length; j++) {
            if ((this.totalArray[j].col == _hexagon.col && Math.abs(this.totalArray[j].row - _hexagon.row) == 1)
                || (_hexagon.col - this.totalArray[j].col == 1 && (_hexagon.row - this.totalArray[j].row == 0 || _hexagon.row - this.totalArray[j].row == -1))
                || (_hexagon.col - this.totalArray[j].col == -1 && (_hexagon.row - this.totalArray[j].row == 0 || _hexagon.row - this.totalArray[j].row == 1))) {
                this.DestoryAnimation(this.totalArray[j]);
                // this.bombExplosion(this.totalArray[j]);
                this.BoomAnimation(this.totalArray[j]);
                if (!this.totalArray[j].select) {
                    this.deleteArray.push(this.totalArray[j]);
                    this.totalArray[j].select = true;
                }
                if (this.totalArray[j].name == 'bomb') {
                    // console.log(this.totalArray.length)
                    this.bombExplosion(this.totalArray[j]);
                    this.bombProps(this.totalArray[j]);
                }
            }
        }
    }

    updateArray() {
        // console.log('delete' + this.deleteArray.length)
        for (let k = 0; k < this.deleteArray.length; k++) {
            let index = this.totalArray.indexOf(this.deleteArray[k]);
            if (index > -1) {
                this.totalArray.splice(index, 1);
            }
        }
        // console.log('total new' + this.totalArray.length)
        // for (let m = 0; m < this.deleteArray.length; m++) {
        //     if (this.deleteArray[m].name == 'bomb') {
        //         this.bombProps(this.deleteArray[m]);
        //     }
        // }
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
