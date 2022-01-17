
import { _decorator, Component, resources, Prefab, AssetManager, assetManager, SpriteAtlas, SpriteFrame, Asset, director } from 'cc';
import { config } from '../data/Config';
import { GlobalParams } from '../data/GlobalParams';
import { Logger } from '../utils/Logger';
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

    private static commonPrefab = []
    //已加载的纹理集
    private static loadedAtlas: { [index: string]: SpriteAtlas } = {};
    //模块加载完成回调
    private static reloadCallBack: (this: void) => void;
    public static isLoading: boolean = false;

    // public static init(callBack: (this: void) => void): void {
    //     resources.load(
    //         AssetsMgr.commonPrefab,
    //         Prefab,
    //         (): void => { },
    //         (error: any, assets: any): void => {
    //             if (error) {
    //                 Logger.warn('prefab加载失败', error);
    //             }
    //             callBack()
    //         }
    //     );
    // }



    public static loadScene(sceneName: string, refresh: boolean, cb: (this: void, error?: any, assets?: any) => void, showLoading: boolean = false, preloadScene: boolean = true): void {
        if (config.sceneConfig[sceneName].isLoaded && !refresh) {
            cb();
            return;
        }
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        this.reloadCallBack = cb;
        if (showLoading) {
            UIMgr.showLoading("场景加载中", true);
        }
        if (preloadScene) {
            director.preloadScene(sceneName, (completedCount: number, totalCount: number) => {
                Logger.log("preloadScene：" + sceneName + ' ' + completedCount + "/" + totalCount)
            }, () => {
                Logger.log("preloadScene：" + sceneName + ' complete')
                this.startReloadModule(sceneName);
            })
        } else {
            this.startReloadModule(sceneName);
        }

    }

    private static startReloadModule(sceneName?: string): void {
        let localGameInfo: any = config.sceneConfig[sceneName];
        let fixAssetsArr: Array<string> = [];
        let assetsArr: Array<string> = localGameInfo.preAssets;
        if (assetsArr) {
            assetsArr.forEach(element => {
                fixAssetsArr.push('prefabs/' + element);
            });
        }

        if (fixAssetsArr.length > 0) {
            resources.load(
                fixAssetsArr,
                Prefab,
                (): void => { },
                (error: any, assets: any): void => {
                    if (error) {
                        Logger.warn('prefab加载失败', error);
                        return;
                    }
                    this.checkModuleAtlas(sceneName);
                }
            );
        } else {
            this.checkModuleAtlas(sceneName);
        }
    }

    private static checkModuleAtlas(sceneName: string): void {
        let localGameInfo: any = config.sceneConfig[sceneName];
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
                        Logger.warn('atlas加载失败' + sceneName, error);
                        return;
                    }
                    for (let i: number = 0; i < fixAtlasArr.length; i++) {
                        this.loadedAtlas[fixAtlasArr[i]] = atlaAssets[i];
                    }
                    this.moduleLoadComplete(sceneName);
                }
            );
        } else {
            this.moduleLoadComplete(sceneName);
        }
    }

    private static moduleLoadComplete(sceneName: string): void {
        config.sceneConfig[sceneName].isLoaded = true;
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
        resources.load(`prefabs/${name}`, Prefab, (err: Error, res: any) => {
            UIMgr.hideLoading();
            if (err) {
                cb(err, null);
                return;
            }
            cb(null, res);
        });
    }
    public static releaseView(name: string): void {
        Logger.log("assets start: ", assetManager.assets)
        resources.release(`prefabs/${name}`)
        Logger.log("assets end: ", assetManager.assets)

        //  cc.loader.release(cc.loader.getDependsRecursively(`prefabs/${name}`));
    }

}

