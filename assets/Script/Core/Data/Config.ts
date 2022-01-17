

interface GameConfg {
    webUrl: string
    version: string
}

interface SceneConfg {
    Start: string
}


class Config {

    public gameConfig: GameConfg;
    public sceneConfig: SceneConfg;

    public init(json) {
        this.gameConfig = json.config;
        this.sceneConfig = json.scene;
    }

}

export const config = new Config()

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.4/manual/zh/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.4/manual/zh/scripting/ccclass.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.4/manual/zh/scripting/life-cycle-callbacks.html
 */
