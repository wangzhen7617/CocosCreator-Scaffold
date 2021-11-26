
import { _decorator, Component, Node, log, resources, Prefab, AssetManager, assetManager, SpriteAtlas, warn, SpriteFrame } from 'cc';
import { GameType } from '../Data/GameType';
import { GlobalParams } from '../Data/GlobalParams';
import { UIMgr } from './UIMgr';
const { ccclass, property } = _decorator;

/**
 * 
 * github = https://github.com/wangzhen7617/CocosCreator-Scaffold
 * 
 * Predefined variables
 * DateTime = Mon Nov 22 2021 17:19:09 GMT+0800 (中国标准时间)
 * Author = <wangzhen7617>
 * FileBasename = AssetsMgr.ts
 * FileBasenameNoExtension = AssetsMgr
 * URL = db://assets/Script/Core/Mgr/AssetsMgr.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/zh/
 *
 */

@ccclass('AssetsMgr')
export class AssetsMgr extends Component {
    //"Prefabs/AlertViewUI", "Prefabs/LoadingViewUI", "Prefabs/TipsViewUI", , "Prefabs/ReconnectViewUI"

    private static commonPrefab = ["Prefabs/MaskViewUI", "Prefabs/HotUpdateViewUI"]
    //已加载的纹理集
    private static loadedAtlas: { [index: string]: SpriteAtlas } = {};
    //模块加载完成回调
    private static reloadCallBack: (this: void) => void;
    public static isLoading: boolean = false;

    public static init(callBack: (this: void) => void): void {
        // callBack()
        // AssetsMgr.loadGame(GameType.Start, true, callBack, true)
        resources.load(
            AssetsMgr.commonPrefab,
            Prefab,
            (): void => { },
            (error: any, assets: any): void => {
                if (error) {
                    warn('prefab加载失败', error);
                    // return;
                }
                log(assets)
                callBack()
            }
        );
    }



    public static loadGame(moduleName: string, refresh: boolean, cb: (this: void, error?: any, assets?: any) => void, showLoading: boolean = true): void {
        log('==============================reloadModule===================', new Date());
        if (GlobalParams.localGameInfo[moduleName].isLoaded && !refresh) {
            cb();
            return;
        }
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        this.reloadCallBack = cb;
        if (showLoading) {
            UIMgr.showLoading("");
        }
        this.startReloadModule(moduleName);
    }

    private static startReloadModule(moduleName?: string): void {
        log('startReloadModule.................', moduleName);
        let localGameInfo: any = GlobalParams.localGameInfo[moduleName];
        let fixAssetsArr: Array<string> = [];
        let assetsArr: Array<string> = localGameInfo.preAssets;
        if (assetsArr) {
            assetsArr.forEach(element => {
                fixAssetsArr.push('Prefabs/' + element);
            });
        }

        if (fixAssetsArr.length > 0) {
            resources.load(
                fixAssetsArr,
                Prefab,
                (): void => { },
                (error: any, assets: any): void => {
                    if (error) {
                        warn('prefab加载失败', error);
                        return;
                    }
                    this.checkModuleAtlas(moduleName);
                }
            );
        } else {
            this.checkModuleAtlas(moduleName);
        }
    }

    private static checkModuleAtlas(moduleName: string): void {
        log('checkModuleAtlas...................', moduleName);
        let localGameInfo: any = GlobalParams.localGameInfo[moduleName];
        let atlas: Array<string> = localGameInfo.preAtlas;
        let fixAtlasArr: Array<string> = [];
        if (atlas) {
            atlas.forEach((element) => {
                let atlasName: string = 'textures/' + element;
                if (!this.loadedAtlas[atlasName]) {
                    fixAtlasArr.push(atlasName);
                }
            })
        }
        if (fixAtlasArr.length > 0) {
            resources.load(
                fixAtlasArr,
                SpriteAtlas,
                (): void => { },
                (error: any, atlaAssets: any[]): void => {
                    if (error) {
                        warn('atlas加载失败' + moduleName, error);
                        return;
                    }
                    for (let i: number = 0; i < fixAtlasArr.length; i++) {
                        this.loadedAtlas[fixAtlasArr[i]] = atlaAssets[i];
                    }
                    this.moduleLoadComplete(moduleName);
                }
            );
        } else {
            this.moduleLoadComplete(moduleName);
        }
    }

    private static moduleLoadComplete(moduleName: string): void {
        log('moduleLoadComplete...................', moduleName);
        GlobalParams.localGameInfo[moduleName].isLoaded = true;
        this.isLoading = false;
        UIMgr.hideLoading();
        if (this.reloadCallBack) this.reloadCallBack();
        this.reloadCallBack = null;
    }

    public static getAtlasFrame(atlasName: string, spriteName: string): SpriteFrame {
        let fixAtlasName = 'textures/' + atlasName;
        if (this.loadedAtlas[fixAtlasName]) {
            return this.loadedAtlas[fixAtlasName].getSpriteFrame(spriteName);
        }
    }

    public static loadView(name: string, cb: (_err: Error, _res: any) => void): void {
        UIMgr.showLoading('加载资源中');
        resources.load(`Prefabs/${name}`, Prefab, (err: Error, res: any) => {
            UIMgr.hideLoading();
            if (err) {
                cb(err, null);
                return;
            }
            cb(null, res);
        });
    }
    public static releaseView(name: string): void {
        log("assets start: ", assetManager.assets)
        resources.release(`Prefabs/${name}`)
        log("assets end: ", assetManager.assets)

        //  cc.loader.release(cc.loader.getDependsRecursively(`Prefabs/${name}`));
    }

}

