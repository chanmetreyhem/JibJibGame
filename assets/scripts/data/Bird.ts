import { _decorator, SpriteFrame } from "cc";
const { ccclass, property } = _decorator;

@ccclass('Bird') // Marks the class as a Cocos serializable class
export class Bird {

    @property
    id: string = "";

    @property
    name: string = "";

    @property({ type: SpriteFrame }) // Explicitly tell Cocos this is a SpriteFrame asset
    spriteFrame: SpriteFrame = null!;
    @property
    price: number = 0;
    @property
    isOwned: boolean = false;
}
