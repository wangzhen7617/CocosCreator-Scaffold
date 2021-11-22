
// import { _decorator, Component, Node, sys } from 'cc';
// import { StorageKeys } from '../Data/StorageKeys';
// import { StorageUtil } from '../Utils/StorageUtil';
// const { ccclass, property } = _decorator;



// @ccclass('AudioMgr')
// export class AudioMgr extends Component {

//     public static _bgmVolume: number = 0.4;
//     public static _sfxVolume: number = 1.0;
//     public static _bgmAudioID: number = -1;
//     public static _currentBGM: string = '';
//     public static b_play_effect: boolean = true;
//     public static _effectID: number = 0;

//     public static clipArr = [];
//     public static maxLength = 14;


//     public static init(): void {
//         let yinLiang =  StorageUtil.read(StorageKeys.BGM_VOLUME);
//         if (yinLiang != null && yinLiang != '') {
//             AudioMgr.setBGMVolume(yinLiang);
//         } else {
//             AudioManager.setBGMVolume(1);
//         }
//         let yinXiao = cc.sys.localStorage.getItem(LocalItems.SFX_VOLUME);
//         if (yinXiao != null && yinXiao != '') {
//             let slider = cc.sys.localStorage.getItem(LocalItems.SFX_VOLUME);
//             AudioManager.setSFXVolume(slider);
//         } else {
//             AudioManager.setSFXVolume(0.8);
//         }

//         //new vibrate
//         let vibrate = cc.sys.localStorage.getItem(LocalItems.VIBRATE);

//         if (vibrate != null && vibrate != '') {
//             let slider = cc.sys.localStorage.getItem(LocalItems.VIBRATE);
//             GlobalParams.vibrate = slider;
//         } else {
//             GlobalParams.vibrate = 1;
//             cc.sys.localStorage.setItem(LocalItems.VIBRATE, 1);
//         }
//     }

//     public static playBGM(url: string): void {
//         let audioUrl: string = `sounds/${url}`;
//         // if (cc.sys.os != cc.sys.OS_IOS && cc.sys.isBrowser) audioUrl = audioUrl + '_dom';
//         // if(AudioManager._bgmAudioID >= 0){
//         //     cc.audioEngine.stop(AudioManager._bgmAudioID);
//         // }
//         // if(AudioManager._bgmVolume <= 0)AudioManager._bgmVolume=0.001;
//         cc.loader.loadRes(audioUrl, cc.AudioClip, (err, clip) => {
//             if (err || !clip) return;
//             AudioManager._currentBGM = audioUrl.substring(7);
//             AudioManager._bgmAudioID = cc.audioEngine.playMusic(clip, true);
//         });
//     }

//     public static playSFX(url: string, lessBgmTime?: number): void {
//         if (!this.b_play_effect) return;
//         let audioUrl: string = `sounds/${url}`;

//         cc.loader.loadRes(audioUrl, cc.AudioClip, (err, clip) => {
//             if (err || !clip) return;
//             audioEngine.playEffect(clip, false);

//         });
//         if (lessBgmTime) {
//             cc.audioEngine.setMusicVolume(Number(AudioManager._bgmVolume / 2));
//             setTimeout(() => {
//                 cc.audioEngine.setMusicVolume(Number(AudioManager._bgmVolume));
//             }, lessBgmTime * 1000);
//         }
//     }

//     public static setSFXVolume(v: number) {
//         if (AudioManager._sfxVolume != v) {
//             cc.sys.localStorage.setItem(LocalItems.SFX_VOLUME, v);
//             AudioManager._sfxVolume = v;
//             cc.audioEngine.setEffectsVolume(Number(v));
//         }
//     }

//     public static setBGMVolume(v: number, force?: boolean) {
//         if (AudioMgr._bgmVolume != v || force) {
//             StorageUtil.save(StorageKeys.BGM_VOLUME,v)
//             AudioMgr._bgmVolume = v;
//             audioEngine.setMusicVolume(Number(v));
//         }
//     }

//     public static stopAll(): void {

//         if (!sys.isNative) {
//             let audioClip = cc.loader.getRes(`sounds/${AudioManager._currentBGM}`);
//             cc.audioEngine.uncache(audioClip);
//             cc.loader.release(cc.loader.getDependsRecursively(audioClip));
//         }


//         AudioManager._currentBGM = null;
//         AudioManager.clipArr = [];
//         cc.audioEngine.stopAll();
//     }
// }

