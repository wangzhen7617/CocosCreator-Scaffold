import { _decorator, EventTarget } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 游戏事件派发
 */
@ccclass('Dispatcher')
export class Dispatcher extends EventTarget {

	/**
	 * 为方便取得事件名称，重写emit,后续再考虑其他方式
	 * @param type
	 * @param arg1 
	 */
    public emit(type:string,arg?:any){
        super.emit(type,arg,type)
    }
    
}