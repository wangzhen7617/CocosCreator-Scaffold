
import { _decorator, Component, Node, log } from 'cc';
import { GameType } from '../Data/GameType';
import { Module } from '../MVC/Module';
import { AlertMgr } from './AlertMgr';
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

    private static completeCallback: (this: void) => void;

    //已加载的纹理集
    private static loadedAtlas: any = {};
    //已加载的单张图片
    private static loadedPics: any = {};

    //各个模块需要加载的预制体
    public static gameAssets: any = {};
    //各个模块需要加载的纹理集
    private static moduleAtlasNames: any = {};
    //各个模块需要加载的单张图片
    private static modulePicNames: any = {};
    //模块加载完成回调
    private static reloadCallBack: (this: void) => void;
    public static isLoading: boolean = false;
    private static loadingList: Array<string> = [];
    private static startGameAtlas: string[] = null;

    public static init(callBack: (this: void) => void): void {
        //预制体
        this.gameAssets[GameType.Start] = ['prefabs/MaskUI', 'prefabs/AlertViewUI', 'prefabs/LoadingViewUI', 'prefabs/TipsViewUI', 'prefabs/HotUpdateViewUI', 'prefabs/ReconnectViewUI'];
        this.moduleAtlasNames[GameType.Start] = [];
        this.modulePicNames[GameType.Start] = [];

        this.completeCallback = callBack;


        AssetsMgr.loadGame(GameType.Start, true, this.checkAssetsComplete, true)

    }
    private static checkAssetsComplete = (): void => {
        AssetsMgr.completeCallback();
        AssetsMgr.completeCallback = null;
    };

    public static loadGame(moduleName: string, refresh: boolean, cb: (this: void, error?: any, assets?: any) => void, showLoading?: boolean): void {
        log('==============================reloadModule===================', new Date());
        this.loadingList = [];

        if (!GlobalParams.localGameInfo[moduleName].isLoaded) {
            this.loadingList.push(moduleName);
        }
        if (this.loadingList.length == 0 && !refresh) {
            cb();
            return;
        }
        if (this.isLoading) {
            // AlertManager.showLoading(i18n.t("TipsTxt.tips_hot_update_downloading"));
            return;
        }
        this.isLoading = true;
        this.reloadCallBack = cb;
        if (showLoading == null) showLoading = true;
        if (showLoading) {
            AlertManager.showLoading(i18n.t('UITxt.ui_sub_game_load_assets'));
        }
        this.startReloadModule();
    }

    private static startReloadModule(name?: string): void {
        let moduleName: string = name ? name : this.loadingList.pop();

        cc.log('startReloadModule.................', moduleName);
        let localGameInfo: any = GlobalParams.localGameInfo[moduleName];
        let fixAssetsArr: Array<string> = [];
        let assetsArr: Array<string> = this.gameAssets[moduleName];
        if (assetsArr) {
            for (let i: number = 0; i < assetsArr.length; i++) {
                fixAssetsArr.push('prefabs/' + assetsArr[i]);
            }
        }

        if (fixAssetsArr.length > 0) {
            // let hascb = false;
            // let time = setTimeout(() => {
            //     cc.error("prefab加载超时");
            //     hascb = true;
            //     this.startReloadModule(moduleName);
            // }, 10000);
            cc.loader.loadResArray(
                fixAssetsArr,
                cc.Prefab,
                (): void => { },
                (error: any, assets: any): void => {
                    // clearTimeout(time);
                    // if (hascb) return;
                    if (error) {
                        cc.error('prefab加载失败', error);
                        setTimeout(() => {
                            this.startReloadModule(moduleName);
                        }, 5000);
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
        cc.log('checkModuleAtlas...................', moduleName);
        let atlas: Array<string> = this.moduleAtlasNames[moduleName];
        let fixAtlasArr: Array<string> = [];
        if (atlas) {
            for (let i: number = 0; i < atlas.length; i++) {
                let atlasName: string = 'textures/' + atlas[i];
                if (!this.loadedAtlas[atlasName]) {
                    fixAtlasArr.push(atlasName);
                }
            }
        }
        if (fixAtlasArr.length > 0) {
            cc.loader.loadResArray(
                fixAtlasArr,
                cc.SpriteAtlas,
                (): void => { },
                (error: any, atlaAssets: any[]): void => {
                    if (error) {
                        cc.warn('atlas加载失败' + moduleName, error);
                        setTimeout(() => {
                            this.checkModuleAtlas(moduleName);
                        }, 3000);
                        return;
                    }
                    for (let i: number = 0; i < fixAtlasArr.length; i++) {
                        this.loadedAtlas[fixAtlasArr[i]] = atlaAssets[i];
                    }
                    this.checkModulePics(moduleName);
                }
            );
        } else {
            this.checkModulePics(moduleName);
        }
    }

    private static checkModulePics(moduleName: string): void {
        cc.log('checkModulePics...................', moduleName);
        let pics: Array<string> = this.modulePicNames[moduleName];
        let fixPicArr: Array<string> = [];
        if (pics) {
            for (let i: number = 0; i < pics.length; i++) {
                let picName: string = 'textures/' + pics[i];
                if (!this.loadedPics[picName]) {
                    fixPicArr.push(picName);
                }
            }
        }
        if (fixPicArr.length > 0) {
            cc.loader.loadResArray(
                fixPicArr,
                cc.SpriteFrame,
                (): void => { },
                (error: any, assets: any): void => {
                    for (let i: number = 0; i < fixPicArr.length; i++) {
                        this.loadedPics[fixPicArr[i]] = assets[i];
                    }
                    this.moduleLoadComplete(moduleName);
                }
            );
        } else {
            this.moduleLoadComplete(moduleName);
        }
    }

    private static moduleLoadComplete(moduleName: string): void {
        cc.log('moduleLoadComplete...................', moduleName);
        GlobalParams.localGameInfo[moduleName].isLoaded = true;
        Utils.saveLocalGameInfo();
        if (this.loadingList.length > 0) {
            this.startReloadModule();
        } else {
            this.isLoading = false;
            AlertManager.hideLoading();
            if (this.reloadCallBack) this.reloadCallBack();
            this.reloadCallBack = null;
        }
    }

    public static getPicFrame(name: string): cc.SpriteFrame {
        if (name.indexOf('textures/') == 0) {
            return this.loadedPics[name];
        } else {
            return this.loadedPics['textures/' + name];
        }
    }

}

