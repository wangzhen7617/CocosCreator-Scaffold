import { ModuleType } from "../../Core/Data/ModuleType";
import { Module } from "../../Core/MVC/Module";
import { _decorator, Component, Node } from 'cc';
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
