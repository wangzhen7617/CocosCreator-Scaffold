import { _decorator, Component, Node } from 'cc';
import { ModuleType } from '../../core/data/ModuleType';
import { Module } from '../../core/puremvc/Module';
const { ccclass, property } = _decorator;


@ccclass('LoginModule')
export class LoginModule extends Module {
    constructor() {
        super();
        this.pushView('LoginViewUI', false);
    }

    public getModuleName(): string {
        return ModuleType.LOGIN;
    }
}
