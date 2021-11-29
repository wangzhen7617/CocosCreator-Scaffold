import { log, sys, warn, _decorator } from 'cc';
import { NotifyEventType } from '../../Core/Data/NotifyEventType';
import { DispatcherEvent } from '../../Core/MVC/DispatcherEvent';
import { Proxy } from '../../Core/MVC/Proxy';
import { NetworkVO } from './Data/NetworkVO';
const { ccclass, property } = _decorator;




@ccclass('NetworkProxy')
export class NetworkProxy extends Proxy {
    private waitGSReturn: boolean = false;
    private waitFSReturn: boolean = false;
    private pingTimerID: any;
    private pingTime: number = 0;
    private timeObj: any = {};

    constructor() {
        super();
        this.vo = new NetworkVO();
    }

    protected addEvent(): void {
        this.addNotification(NotifyEventType.NETWORK_REQUEST_HTTP, this.onRequestHttp);
        // this.addNotification(NotifyEventType.NETWORK_STOP_PING, this.stopClientPing);
        // this.addNotification(NotifyEventType.SOCKET_CONNECT_SUCCESS, this.onSocketConnected);
        // this.addNotification(NotifyEventType.SOCKET_CLOSED, this.onSocketClose);
        // this.addNotification(NotifyEventType.SOCKET_ERROR, this.onSocketError);
        // this.addNotification(NotifyEventType.RECONNECT_DO_RECONNECT, this.onDoReconnect);

        // this.sendNotification(NotifyEventType.SOCKET_ADD_SOCKET_EVENT, { code: s2c.PING, callback: this.onGSPingCMD });
    }

    // private onGSPingCMD = (body: any): void => {
    //     // cc.log("client ping returned:::GS");
    //     this.waitGSReturn = false;
    //     this.pingTime = new Date().getTime();
    // };

    // private onPingFromGSCMD = (body: any): void => {
    //     this.sendNotification(NotifyEventType.SOCKET_SEND_PACKAGE, { code: c2s.PING, body: null });
    // };

    // private onSocketConnected = (): void => {
    //     AlertManager.removeModule(ModuleType.RECONNECT);
    //     this.startClientPing();
    // };

    // private onSocketError = (data: any): void => {
    //     this.vo.isGSReconnect = false;
    // };

    // private onSocketClose = (data: any): void => {
    //     cc.log('socket closed:::::::::::::::');
    //     let loginVO = this.getModuleVO(ModuleType.LOGIN);
    //     if (loginVO.isLoginOtherPlace || loginVO.loginState == LoginState.RELOGIN || AlertManager.hasModule(ModuleType.RECONNECT)) {
    //         return;
    //     }
    //     this.stopClientPing();
    //     loginVO.loginState = LoginState.DEFAULT;
    //     AlertManager.showModule(ModuleType.RECONNECT);
    // };

    // public startClientPing = (): void => {
    //     if (this.pingTimerID != null) return;
    //     this.pingTime = new Date().getTime();
    //     this.pingTimerID = setInterval(() => {
    //         // console.log('发送心跳');
    //         this.pingGS();
    //     }, 1000);
    // };

    // public stopClientPing(): void {
    //     clearInterval(this.pingTimerID);
    //     this.pingTimerID = null;
    //     this.pingTime = null;
    // }

    // private pingGS(): void {
    //     if (this.getModuleVO(ModuleType.LOGIN).loginState != LoginState.LOGINED) {
    //         this.waitGSReturn = false;
    //         cc.log('====pingGS loginState error=====', this.getModuleVO(ModuleType.LOGIN).loginState);
    //         return;
    //     }
    //     if (this.waitGSReturn && this.pingTime && new Date().getTime() - this.pingTime > 5000) {
    //         cc.log('====pingGS close socket=====');
    //         this.waitGSReturn = false;
    //         this.sendNotification(NotifyEventType.SOCKET_LOGIN_OTHER_PLACE);
    //         this.getModuleVO(ModuleType.SOCKET).gameSocket.close();
    //     } else {
    //         let msg_Heartbeat_Req = PBBuild.EncodeBuild('Protobufs/gateway', 'MSG_Heartbeat_Req');
    //         let timeStamp = new Date().getTime();
    //         msg_Heartbeat_Req.setTimeStamp(timeStamp);
    //         let bodyBuf: any = msg_Heartbeat_Req.encode().toBuffer();
    //         // cc.log("====send pingGS=====",timeStamp);
    //         this.waitGSReturn = true;
    //         this.sendNotification(NotifyEventType.SOCKET_SEND_PACKAGE, { code: c2s.PING, body: bodyBuf });
    //     }
    // }

    // private onDoReconnect = (): void => {
    //     if (!this.getModuleVO(ModuleType.SOCKET).getSocketIsOpen()) {
    //         if (!this.vo.isGSReconnect) {
    //             // this.sendNotification(NotifyEventType.SOCKET_CREATE_GAME_SOCKET);
    //             this.sendNotification(NotifyEventType.LOGIN_SEND_LOGIN_TO_SERVER);
    //         }
    //         this.vo.isGSReconnect = true;
    //     }
    // };

    private onRequestHttp = (event: DispatcherEvent): void => {
        let data = event.detail;
        let requestURL: string = data.url;
        let handler: (this: void, ret: any) => void = data.handler;
        let errorHandler: (this: void) => void = data.errHandler;
        let parseJson: boolean = null == data.parseJson ? true : data.parseJson;
        if (!sys.isNative) {
            if (!window.navigator.onLine && errorHandler) {
                warn('=====无网络连接======');
                errorHandler();
                return;
            }
        }
        let xhr: XMLHttpRequest = new XMLHttpRequest();
        log('RequestURL:' + requestURL);
        xhr.open(data.requestType ? data.requestType : 'GET', requestURL, true);
        xhr.timeout = 5000;

        if (data.requestType == 'POST') {
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        }
        if (sys.isNative) {
            xhr.setRequestHeader('Accept-Encoding', 'gzip,deflate');
        }

        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    let ret: string = '';
                    if (parseJson) {
                        try {
                            ret = JSON.parse(xhr.responseText);
                        } catch (e) {
                            log('err:' + e);
                        }
                    } else {
                        ret = xhr.responseText;
                    }
                    if (handler) {
                        handler(ret);
                    }
                } else if (errorHandler) {
                    console.warn('error xhr.status = ' + xhr.status);
                    errorHandler();
                }
            }
        };
        xhr.onerror = () => {
            if (errorHandler) {
                errorHandler();
            }
        };
        if (data.requestType == 'POST') {
            log('send data.postData.....', data.postData);
            xhr.send(data.postData);
        } else {
            xhr.send();
        }
    };
}
