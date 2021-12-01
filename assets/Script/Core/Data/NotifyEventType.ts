
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 
 * github = https://github.com/wangzhen7617/CocosCreator-Scaffold
 * 
 * Predefined variables
 * DateTime = Mon Nov 22 2021 19:39:43 GMT+0800 (中国标准时间)
 * Author = <wangzhen7617>
 * FileBasename = NotifyEventType.ts
 * FileBasenameNoExtension = NotifyEventType
 * URL = db://assets/Script/Core/Data/NotifyEventType.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/zh/
 *
 */

@ccclass('NotifyEventType')
export class NotifyEventType extends Component {

    //hotupdate
    public static HOT_UPDATE_SWITCH_NEXT: string = 'HOT_UPDATE_SWITCH_NEXT';
    //login

    //network
    public static NETWORK_REQUEST_HTTP: string = 'NETWORK_REQUEST_HTTP';
    public static NETWORK_STOP_PING: string = 'NETWORK_STOP_PING';

    //socket
    public static SOCKET_ADD_SOCKET_EVENT: string = 'SOCKET_ADD_SOCKET_EVENT';
    public static SOCKET_CONNECT_SUCCESS: string = 'SOCKET_CONNECT_SUCCESS';
    public static SOCKET_LOGIN_OTHER_PLACE: string = 'SOCKET_LOGIN_OTHER_PLACE';
    public static SOCKET_SEND_PACKAGE: string = 'SOCKET_SEND_PACKAGE';
    public static SOCKET_CLOSED: string = 'SOCKET_CLOSED';
    public static SOCKET_ERROR: string = 'SOCKET_ERROR';
    public static SOCKET_CREATE_GAME_SOCKET: string = 'SOCKET_CREATE_GAME_SOCKET';

    //scene
    public static SCENE_SWITCH_SCENE: string = 'SCENE_SWITCH_SCENE';

    //reconnect
    public static RECONNECT_DO_RECONNECT: string = 'RECONNECT_DO_RECONNECT';
    public static RECONNECT_RETURN_TO_LOGIN: string = 'RECONNECT_RETURN_TO_LOGIN';
    public static RECONNECT_RECONNECT_TIMEOUT: string = 'RECONNECT_RECONNECT_TIMEOUT';

    //room
    public static ROOM_SEND_ENTER_SCENE: string = 'ROOM_SEND_ENTER_SCENE';
    public static ROOM_SEND_LEAVE_SCENE: string = 'ROOM_SEND_LEAVE_SCENE';


    public static TEST_TO_POST: string = 'TEST_TO_POST'
    public static TEST_ON_POST: string = 'TEST_ON_POST'
    public static TEST_CREATE_WEBSOCKET: string = 'TEST_CREATE_WEBSOCKET'
    public static TEST_CREATE_WEBSOCKET_SUCCESS: string = 'TEST_CREATE_WEBSOCKET_SUCCESS'

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
