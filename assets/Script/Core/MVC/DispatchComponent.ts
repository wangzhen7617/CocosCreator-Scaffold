
import { _decorator, Component, Node } from 'cc';
import { Dispatcher } from './Dispatcher';
const { ccclass, property } = _decorator;


 
@ccclass('DispatchComponent')
export class DispatchComponent extends Component {
    public dispatcher:Dispatcher;
    public data:any;
}

