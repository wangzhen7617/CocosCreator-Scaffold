import { error, isValid, log, sys, warn, _decorator } from 'cc';
import { ModuleType } from '../../Core/Data/ModuleType';
import { NotifyEventType } from '../../Core/Data/NotifyEventType';
import { UIMgr } from '../../Core/Mgr/UIMgr';
import { DispatcherEvent } from '../../Core/MVC/DispatcherEvent';
import { Proxy } from '../../Core/MVC/Proxy';
import { LoginState } from '../Login/Data/LoginState';
import { c2s } from './Data/c2s';
import { NetworkVO } from './Data/NetworkVO';
import { s2c } from './Data/s2c';
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

        this.addNotification(NotifyEventType.SOCKET_CREATE_GAME_SOCKET, this.onCreatGameSocket);
        this.addNotification(NotifyEventType.SOCKET_ADD_SOCKET_EVENT, this.onAddSocketEvent);
        this.addNotification(NotifyEventType.SOCKET_LOGIN_OTHER_PLACE, this.loginOtherPlace);
        this.addNotification(NotifyEventType.SOCKET_SEND_PACKAGE, this.onSendPackage);

        this.sendNotification(NotifyEventType.SOCKET_ADD_SOCKET_EVENT, { code: s2c.PING, callback: this.onGSPingCMD });
    }

    public removeEvent(): void {
        super.removeEvent();
        this.vo.isSocketConnected = false;
        this.loginOtherPlace();
    }



    private onGSPingCMD = (body: any): void => {
        // cc.log("client ping returned:::GS");
        this.waitGSReturn = false;
        this.pingTime = new Date().getTime();
    };

    private onSocketConnected = (): void => {
        UIMgr.removeModule(ModuleType.RECONNECT);
        this.startClientPing();
    };

    private onSocketError = (data: any): void => {
        this.vo.isGSReconnect = false;
    };

    private onSocketClose = (data: any): void => {
        let loginVO = this.getModuleVO(ModuleType.LOGIN);
        if (loginVO.isLoginOtherPlace || loginVO.loginState == LoginState.RELOGIN || UIMgr.hasModule(ModuleType.RECONNECT)) {
            return;
        }
        this.stopClientPing();
        loginVO.loginState = LoginState.DEFAULT;
        UIMgr.showModule(ModuleType.RECONNECT);
    };

    public startClientPing = (): void => {
        if (this.pingTimerID != null) return;
        this.pingTime = new Date().getTime();
        this.pingTimerID = setInterval(() => {
            // console.log('发送心跳');
            this.pingGS();
        }, 1000);
    };

    public stopClientPing(): void {
        clearInterval(this.pingTimerID);
        this.pingTimerID = null;
        this.pingTime = null;
    }

    private pingGS(): void {
        if (this.getModuleVO(ModuleType.LOGIN).loginState != LoginState.LOGINED) {
            this.waitGSReturn = false;
            log('====pingGS loginState error=====', this.getModuleVO(ModuleType.LOGIN).loginState);
            return;
        }
        if (this.waitGSReturn && this.pingTime && new Date().getTime() - this.pingTime > 5000) {
            log('====pingGS close socket=====');
            this.waitGSReturn = false;
            this.sendNotification(NotifyEventType.SOCKET_LOGIN_OTHER_PLACE);
            this.getModuleVO(ModuleType.SOCKET).gameSocket.close();
        } else {
            let timeStamp = new Date().getTime();
            this.waitGSReturn = true;
            let bodyBuffer: ArrayBuffer = new ArrayBuffer(8);
            this.sendNotification(NotifyEventType.SOCKET_SEND_PACKAGE, { code: c2s.PING, body: bodyBuffer });
        }
    }

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

    //=============================================================  WebSocket  =================================================================
    private onCreatGameSocket = (event: DispatcherEvent): void => {
        console.log('onCreatGameSocket ws:' + event.detail.ws);
        this.getSocket(event.detail.ws);
        this.vo.gameSocket.binaryType = 'arraybuffer';
    };

    private getSocket = (url: string) => {
        if (isValid(this.vo.gameSocket) && this.vo.gameSocket.readyState == WebSocket.OPEN) {
            if (url == this.vo.gameSocketUrl) return;
            this.vo.gameSocket.close();
        }
        this.vo.gameSocket = new WebSocket(url);
        this.vo.gameSocketUrl = url;
        this.vo.gameSocket.onopen = this.callBackOfOpen;
        this.vo.gameSocket.onmessage = this.callBackOfMessage;
        this.vo.gameSocket.onclose = this.callBackOfClose;
        this.vo.gameSocket.onerror = this.callBackOfError;
    };

    private callBackOfOpen = (): void => {
        this.vo.isSocketConnected = true;
        // this.sendNotification(NotifyEventType.SOCKET_CONNECT_SUCCESS);
        this.onSocketConnected()
    };

    //服务器端返回数据
    private callBackOfMessage = (event: any): void => {
        log(event.data)
        if (typeof event.data == 'string') {
            warn('服务器端返回string数据', event.data)
            return
        }
        let msgBuffer: ArrayBuffer = event.data;
        let msgView = new DataView(msgBuffer);

        let offset = 0;
        while (offset != msgView.byteLength) {
            if (offset != 0) console.warn('offset != 0');
            let length = msgView.getInt32(offset, true);

            if (length + 4 != msgView.byteLength) console.warn(length, msgView);

            let protocol = msgView.getInt32(offset + 4, true);
            // cc.log('protocol', protocol);
            let sliceBuf = msgBuffer.slice(offset + 8, offset + 4 + length);
            this.vo.executeSocketEvent(protocol, sliceBuf);
            offset += offset + length + 4;
        }
    };

    private callBackOfClose = (event: any): void => {
        //防止初始化的时候没连上就触发断线重连
        if (!this.vo.isSocketConnected) return;
        this.vo.isSocketConnected = false;
        error('===socket关闭===');
        this.sendNotification(NotifyEventType.SOCKET_CLOSED);
    };

    private callBackOfError = (event: any) => {
        error('===web Socket On Error:%s==', event);
        this.sendNotification(NotifyEventType.SOCKET_ERROR);
    };

    private onSendPackage = (event: DispatcherEvent): void => {
        log("onSendPackage", event)
        let data = event.detail;
        if (this.vo.getSocketIsOpen() == false) {
            error('提示：服务器处于断开状态，发送失败！');
            return;
        }
        let bodyBuffer: ArrayBuffer = data.body;
        let bodyView: DataView = new DataView(bodyBuffer);

        let protocol: number = data.code;
        let msgBuffer: ArrayBuffer = new ArrayBuffer(bodyBuffer.byteLength + 4 + 4);
        let dataView: DataView = new DataView(msgBuffer);
        dataView.setInt32(0, bodyBuffer.byteLength + 4, true);
        dataView.setInt32(4, protocol, true);

        for (let i = 0; i < bodyBuffer.byteLength; i++) {
            dataView.setInt8(4 + 4 + i, bodyView.getInt8(i));
        }
        if (this.vo.gameSocket && this.vo.gameSocket.readyState == 1) {
            this.vo.gameSocket.send(msgBuffer);
        }
    };

    private onAddSocketEvent = (event: DispatcherEvent): void => {
        let data = event.detail
        this.vo.addSocketEvent(data.code, data.callback);
    };

    private loginOtherPlace = (): void => {
        log('===loginTtherPlace===');
        if (this.vo.gameSocket != null) {
            this.sendNotification(NotifyEventType.NETWORK_STOP_PING);
            // this.vo.gameSocket.close(3001, 'force close');
            this.vo.gameSocket.close();
        }
    };
}
