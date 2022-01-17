
export class NetworkVO {
    // public static isGSReconnect: boolean = false;
    // public static isFSReconnect: boolean = false;

    public gameSocket: WebSocket;
    public gameSocketUrl: string;
    public socketEventMap: { [code: number]: (this: void, body: any) => void } = {};
    public isSocketConnected: boolean;

    public addSocketEvent = (code: number, callback: (this: void, body: any) => void): void => {
        this.socketEventMap[code] = callback;
    }

    public executeSocketEvent(code: number, body: any): void {
        let callback: any = this.socketEventMap[code];
        if (callback != null) {
            callback(body);
        }
    }

    public getSocketIsOpen(): boolean {
        return this.gameSocket != null && this.gameSocket.readyState == WebSocket.OPEN;
    }
}
