
import { _decorator, Component, Node, sys, JsonAsset, AssetManager, Label, Game, Prefab, instantiate, EventTouch, Vec3, UITransform, Vec2, warn, loader, log, Graphics, view } from 'cc';
import { BUILD, JSB } from 'cc/env';
import { Cell } from '../../../../resources/Prefabs/Cell';
import { BaseModule } from '../../../Core/Base/BaseModule';
import { BaseView } from '../../../Core/Base/BaseView';
import { GameType } from '../../../Core/Data/GameType';
import { GlobalParams } from '../../../Core/Data/GlobalParams';
import { NotifyEventType } from '../../../Core/Data/NotifyEventType';
import { AssetsMgr } from '../../../Core/Mgr/AssetsMgr';
import { UIMgr } from '../../../Core/Mgr/UIMgr';
const { ccclass, property } = _decorator;

/**
 * 
 * github = https://github.com/wangzhen7617/CocosCreator-Scaffold
 * 
 * Predefined variables
 * DateTime = Tue Nov 23 2021 19:06:32 GMT+0800 (中国标准时间)
 * Author = <wangzhen7617>
 * FileBasename = HotUpdateView.ts
 * FileBasenameNoExtension = HotUpdateView
 * URL = db://assets/Script/Modules/Hotupdate/View/HotUpdateView.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/zh/
 *
 */

@ccclass('HotUpdateView')
export class HotUpdateView extends BaseModule {

    @property(JsonAsset)
    cfgJson: JsonAsset = null;
    @property(Label)
    tip: Label = null;

    @property(Prefab)
    cell: Prefab = null;

    @property(Prefab)
    Line: Prefab = null;

    @property(Node)
    contain: Node = null;

    cells = [];
    selectedIndex = [];
    selectedCells = [];
    nodeLines = []
    curIndex = -1;

    start() {
        super.start();
    }

    protected initView(): void {
        // Hot update is only available in Native build
        if (sys.isNative && JSB && BUILD) {
            this.initHotUpdate()
        } else {
            this.runGame();
        }
    }

    protected addEvent(): void { }

    protected removeEvent(): void { }

    protected onDestroy(): void { }

    private initHotUpdate(): void { }

    private runGame() {

        //     let json: any = this.cfgJson.json;
        //     GlobalParams.localGameInfo = json.Game;;
        //     this.sendEvent(NotifyEventType.HOT_UPDATE_SWITCH_NEXT, "test")

        for (let i = 0; i < 5 * 5; i++) {
            let cell = instantiate(this.cell);
            cell.parent = this.contain;
            cell.name = i + ""
            this.cells[i] = cell;
            // cell.children[0].getComponent(Label).string = "" + (Math.floor(Math.random() * 2) + 1)
            cell.children[0].getComponent(Label).string = cell.name
            cell.on(Node.EventType.TOUCH_START, this.clickCellStart, this)
            cell.on(Node.EventType.TOUCH_END, this.clickCellEnd, this)
            cell.on(Node.EventType.TOUCH_MOVE, this.clickCellMove, this)
        }





    }

    onLoadCallback() {
        UIMgr.showModule(GameType.Start);
    }

    clickCellStart(event: EventTouch) {
        let node = event.target as Node
        this.selectedIndex.push(Number(node.name))
        this.selectedCells.push(node)
        this.curIndex = Number(node.name);
        log(event.getLocation())
    }
    clickCellEnd(event: EventTouch) {
        log(event)
    }

    clickCellMove(event: EventTouch) {
        log(event.getUILocation())
        // return

        let left = this.curIndex - 1;
        if ((left + 5) % 5 < this.curIndex % 5) {
            if (this.isTarget(event.getUILocation(), left)) {
                return
            }
        }

        let right = this.curIndex + 1;
        if (right % 5 > this.curIndex % 5) {
            if (this.isTarget(event.getUILocation(), right)) {
                return
            }
        }

        let top = this.curIndex + 5;
        if (top / 5 < 5) {
            if (this.isTarget(event.getUILocation(), top)) {
                return
            }
        }

        let bottom = this.curIndex - 5;
        if (bottom >= 0) {
            if (this.isTarget(event.getUILocation(), bottom)) {
                return
            }
        }
    }

    isTarget(pos: Vec2, index: number) {
        let node = this.cells[index] as Node
        let x = pos.x - view.getCanvasSize().x / 2
        let y = pos.y - view.getCanvasSize().y / 2

        log(node.getComponent(UITransform).getBoundingBox(), new Vec2(x, y), index)
        if (node.getComponent(UITransform).getBoundingBox().contains(new Vec2(x, y))) {
            let cell: Cell = node.getComponent(Cell);
            if (cell.isSelected()) {
                if (this.selectedIndex.length > 1 && index == this.selectedIndex[this.selectedIndex.length - 2]) {
                    let last = this.selectedCells.pop() as Node;
                    last.getComponent(Cell).select(false)
                    let line = this.nodeLines.pop() as Node
                    line.destroy()
                    this.selectedIndex.pop()
                } else {
                    warn('warn')
                }
            } else {
                cell.select(true)
                this.addLine(this.selectedCells[this.selectedCells.length - 1], node)
                this.selectedCells.push(node)
                this.selectedIndex.push(index)
                //add line

            }
            return true
        } else {
            return false
        }
    }

    addLine(startNode: Node, endNode: Node) {

        let line = instantiate(this.Line)
        line.parent = this.node
        line.getComponent(Graphics).moveTo(startNode.position.x, startNode.position.y)
        line.getComponent(Graphics).lineTo(endNode.position.x, endNode.position.y);
        line.getComponent(Graphics).stroke()
        this.nodeLines.push(line);

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
