
import { _decorator, Component, Node, log, Prefab, instantiate, Vec3, EventTouch, Tween, tween, easing, warn, Animation, UITransform, Vec2, Label } from 'cc';
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
    totalArray: Node[] = []//方块总数
    totalPosition: any[] = []//存放每个方块的位置
    selectArray: Node[] = []//选中方块数组
    deleteArray: Node[] = []//删除的方块数组

    colNum: any = {};//删除元素的每列个数
    isHold: boolean = false;//是否按下
    canTouch: boolean = true //是否响应触摸
    starHeight: number = 96; //六边形排列高
    starWidth: number = 104//六边形排列宽
    hexSide: number = 4;//每边四个
    bombNumber: number = 0;//炸弹数量
    gameEnded: boolean = false

    currentLevel = 1;//当前等级
    currentLevelScore = 0;//当前等级分数
    targetScore = 8;//当前等级目标分数
    remainSteps = 2; // 剩余的步数

    colorArray: string[] = new Array('1', '2', '3', '4'); //颜色数组

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
    @property(Node)
    newStarGroup: Node = null;
    @property(Label)
    score: Label = null;





    start() {
        super.start()
    }

    protected initView() {
        this.currentLevel = 1;//当前等级
        this.currentLevelScore = 0;//当前等级分数
        this.targetScore = 8;//当前等级目标分数
        this.remainSteps = 2; // 剩余的步数

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


                let index = parseInt((Math.random() * this.colorArray.length).toString());

                let node = instantiate(this.hexagon)
                node.parent = this.hexgroup;
                if (Math.random() > 1.9) {
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
        this.selectArray.push(node);//消灭方块数组
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
                    this.onMouseEnter(this.totalArray[j])
                    break
                }
            }




        }

    }

    private onMouseEnter(node: Node) {
        if (!this.isHold) {
            return
        }
        if (this.gameEnded) {
            return;
        }
        let _hexagon = node.getComponent(Hexagon)




        if (this.selectArray[this.selectArray.length - 1].getComponent(Hexagon).indexColor == _hexagon.indexColor) {
            if ((Math.abs(this.selectArray[this.selectArray.length - 1].getComponent(Hexagon).row - _hexagon.row) == 1 && this.selectArray[this.selectArray.length - 1].getComponent(Hexagon).col == _hexagon.col)
                || (this.selectArray[this.selectArray.length - 1].getComponent(Hexagon).col - _hexagon.col == 1 && (this.selectArray[this.selectArray.length - 1].getComponent(Hexagon).row - _hexagon.row == 0 || this.selectArray[this.selectArray.length - 1].getComponent(Hexagon).row - _hexagon.row == -1))
                || (this.selectArray[this.selectArray.length - 1].getComponent(Hexagon).col - _hexagon.col == -1 && (this.selectArray[this.selectArray.length - 1].getComponent(Hexagon).row - _hexagon.row == 0 || this.selectArray[this.selectArray.length - 1].getComponent(Hexagon).row - _hexagon.row == 1))) {

                tween(node).to(0.1, { scale: new Vec3(1.1, 1.1) }, { easing: "bounceOut" }).start()
                // Laya.SoundManager.playSound("sound/select.mp3", 1, new Laya.Handler(this, null));
                if (!_hexagon.select) {
                    this.drawLine(this.selectArray[this.selectArray.length - 1].getComponent(Hexagon), _hexagon);
                    this.selectArray.push(node);//消灭方块数组
                    _hexagon.select = true;
                    _hexagon.eventSelect = true;
                    if (node.name != 'lbx') {
                        this.selectHasBomb.push(node);
                    }
                }
            }
        }

        if (this.selectArray.length > 2 && node == this.selectArray[this.selectArray.length - 2]) {
            this.linegroup.children[this.linegroup.children.length - 1].destroy();
            this.selectArray[this.selectArray.length - 1].getComponent(Hexagon).select = false;
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
        log('hex2pixel', x, y)
        return new Vec3(x, -y);
    }



    onStartMouseUp(event: MouseEvent) {
        // let DIV = document.getElementById("layaCanvas");
        // DIV.onmouseout = function () {
        //     console.log(1);
        // }

        let node = event.currentTarget;
        if (this.isHold) {

            this.linegroup.destroyAllChildren();
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

                this.scheduleOnce(this.verticalFall, 0.15)
            } else {
                this.selectArray.forEach(item => {
                    item.getComponent(Hexagon).select = false;
                })
                this.selectHasBomb = [];
                this.selectArray = [];
            }
        }
    }

    /**
 * 垂直下落填充方法
 * 消除后要补充被消除掉的元素，补充动画元素前
 * 按列把被消元素的上方元素下降，无可降后再随机进行填充
 * 填满被消除的个数
 */
    verticalFall() {
        // console.log(this.deleteArray.length)
        this.currentLevelScore += this.deleteArray.length;
        this.score.string = this.currentLevelScore.toString();
        // this.changeProcessBar(this.deleteArray.length);

        for (let i = 0; i < this.deleteArray.length; i++) {
            let col = this.deleteArray[i].getComponent(Hexagon).col;
            // let row = this.deleteArray[i].row;
            if (!this.colNum[col]) {
                this.colNum[col] = 1;
            } else {
                this.colNum[col]++;
            }
        }
        // console.log(this.colNum)
        // 要获取某一列方块 下方 消除方块的个数
        this.totalArray.forEach(tolItem => {
            this.deleteArray.forEach(item => {
                if (item.getComponent(Hexagon).col == tolItem.getComponent(Hexagon).col && item.getComponent(Hexagon).row > tolItem.getComponent(Hexagon).row) {
                    tolItem.getComponent(Hexagon).count++;
                }
            })
        })

        for (let i = 0; i < this.totalArray.length; i++) {
            for (let j = 0; j < this.deleteArray.length; j++) {
                if (this.deleteArray[j].getComponent(Hexagon).col == this.totalArray[i].getComponent(Hexagon).col && this.deleteArray[j].getComponent(Hexagon).row > this.totalArray[i].getComponent(Hexagon).row) {
                    tween(this.totalArray[i])
                        .to(0.1 + 0.1 * this.totalArray[i].getComponent(Hexagon).count, { position: new Vec3(this.totalArray[i].position.x, this.totalArray[i].position.y - 90 * this.totalArray[i].getComponent(Hexagon).count) }, { easing: 'sineOut' })
                        .to(0.1, { position: new Vec3(this.totalArray[i].position.x, this.totalArray[i].position.y - 90 * this.totalArray[i].getComponent(Hexagon).count - 10 - 5 * this.setBounceDistance(this.totalArray[i].getComponent(Hexagon).count)) }, { easing: 'sineOut' })
                        .to(0.1, { position: new Vec3(this.totalArray[i].position.x, this.totalArray[i].position.y - 90 * this.totalArray[i].getComponent(Hexagon).count) }, { easing: 'sineOut' }).start();

                    this.totalArray[i].getComponent(Hexagon).row += this.totalArray[i].getComponent(Hexagon).count;
                    break;
                }
            }
        }
        // this.selectHasBomb = [];
        // this.deleteArray = [];
        // this.colNum = {};
        // this.canTouch = true;
        // this.remainSteps--;
        this.scheduleOnce(this.creatNewStar, 0.3)
    }

    /**
     * 生成新的元素
     */
    creatNewStar() {
        this.totalArray.forEach(tolItem => {
            tolItem.getComponent(Hexagon).count = 0;
        })


        for (let p = -this.hexSide; p <= this.hexSide; p++) {
            if (this.colNum[p] != null) {
                for (let q = 0; q < this.colNum[p]; q++) {
                    let index = parseInt((Math.random() * this.colorArray.length).toString());

                    let node = instantiate(this.hexagon)
                    node.parent = this.newStarGroup;

                    node.getComponent(Hexagon).setSprite(index)
                    node.name = "lbx";
                    // node.getComponent(Hexagon).init(i, j, index)

                    let _hexagon = node.getComponent(Hexagon);


                    if (p >= 0) {
                        node.setPosition(this.hex2pixel({ i: -4 - q - 1, j: p }, this.starWidth).x, this.hex2pixel({ i: -4 - q - 1, j: p }, this.starWidth).y);
                        _hexagon.row = -4 - q + this.colNum[p];
                    } else {
                        node.setPosition(this.hex2pixel({ i: (-3 - p - q - 1 - 1), j: p }, this.starWidth).x, this.hex2pixel({ i: -3 - p - q - 1 - 1, j: p }, this.starWidth).y);
                        _hexagon.row = -3 - p - q - 1 + this.colNum[p];
                    }
                    _hexagon.indexColor = index;
                    _hexagon.col = p;
                    _hexagon.count = 0;
                    _hexagon.select = false;
                    this.totalArray.push(node);
                    node.on(Node.EventType.TOUCH_START, this.onTouchStart, this)
                    node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this)
                }
            }
        }
        // if (Math.random() > 0.85) {
        //     let index = parseInt((Math.random() * this.newStarGroup.children.length - 1).toString());
        //     this.newStarGroup.children[index].getComponent(Hexagon).setSprite(this.newStarGroup.children[index].getComponent(Hexagon).indexColor);
        //     this.newStarGroup.children[index].name = "bomb";
        // }


        //下落
        for (let k = 0; k < this.deleteArray.length; k++) {
            tween(this.newStarGroup.children[k])
                .to(0.3, {
                    position: new Vec3(this.newStarGroup.children[k].position.x, this.newStarGroup.children[k].position.y - 90 * (this.colNum[this.newStarGroup.children[k].getComponent(Hexagon).col] + 1))
                }, { easing: 'sineOut' })
                .to(0.1, { position: new Vec3(this.newStarGroup.children[k].position.x, this.newStarGroup.children[k].position.y - 90 * (this.colNum[this.newStarGroup.children[k].getComponent(Hexagon).col] + 1) - 10 - 5 * this.setBounceDistance(this.colNum[this.newStarGroup.children[k].getComponent(Hexagon).col])) }, { easing: 'sineOut' })
                .to(0.1, { position: new Vec3(this.newStarGroup.children[k].position.x, this.newStarGroup.children[k].position.y - 90 * (this.colNum[this.newStarGroup.children[k].getComponent(Hexagon).col] + 1)) })
                .start()
        }
        log(this.newStarGroup.children, this.deleteArray.length)


        while (this.newStarGroup.children.length > 0) {
            this.newStarGroup.children[0].parent = this.hexgroup;
        }
        log(22, this.newStarGroup.children, this.deleteArray.length)
        this.selectHasBomb = [];
        this.deleteArray = [];
        this.colNum = {};
        this.canTouch = true;
        this.remainSteps--;




        // this.targetScoreText.changeText('剩余步数: ' + this.remainSteps);
    }

    /**
     * 下落反弹设定
     */
    setBounceDistance(count) {
        if (count <= 4) {
            return count - 1
        } else {
            return 3
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
            line.angle = -60;
        } else {
            // console.log("右斜")
            line.angle = -120;
        }
    }

    /**
     * 消失动画
     */
    DestoryAnimation(item: Node) {
        tween(item).to(0.3, { scale: new Vec3(0.1, 0.1) }).call(() => {
            item.destroy()
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
    BoomAnimation(item: Node) {
        let boom = instantiate(this.boom);
        boom.parent = this.boomgroup;
        boom.position = item.position;
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
            if ((this.totalArray[j].getComponent(Hexagon).col == _hexagon.col && Math.abs(this.totalArray[j].getComponent(Hexagon).row - _hexagon.row) == 1)
                || (_hexagon.col - this.totalArray[j].getComponent(Hexagon).col == 1 && (_hexagon.row - this.totalArray[j].getComponent(Hexagon).row == 0 || _hexagon.row - this.totalArray[j].getComponent(Hexagon).row == -1))
                || (_hexagon.col - this.totalArray[j].getComponent(Hexagon).col == -1 && (_hexagon.row - this.totalArray[j].getComponent(Hexagon).row == 0 || _hexagon.row - this.totalArray[j].getComponent(Hexagon).row == 1))) {
                this.DestoryAnimation(this.totalArray[j]);
                // this.bombExplosion(this.totalArray[j]);
                this.BoomAnimation(this.totalArray[j]);
                if (!this.totalArray[j].getComponent(Hexagon).select) {
                    this.deleteArray.push(this.totalArray[j]);
                    this.totalArray[j].getComponent(Hexagon).select = true;
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
        console.log('delete' + this.deleteArray.length)
        for (let k = 0; k < this.deleteArray.length; k++) {
            let index = this.totalArray.indexOf(this.deleteArray[k]);
            if (index > -1) {
                this.totalArray.splice(index, 1);
            }
        }
        console.log('total new' + this.totalArray.length)


        // for (let m = 0; m < this.deleteArray.length; m++) {
        //     if (this.deleteArray[m].name == 'bomb') {
        //         this.bombProps(this.deleteArray[m]);
        //     }
        // }
    }


    update(dt: number) {
        // log(this.totalArray.length)
        this.totalArray.forEach(ele => {
            ele.children[0].getComponent(Label).string = ele.getComponent(Hexagon).row + "-" + ele.getComponent(Hexagon).col
        })
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
