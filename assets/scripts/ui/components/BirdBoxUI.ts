import { _decorator, Component, Label, Node, Sprite, SpriteFrame, instantiate } from 'cc';
import { Bird } from '../../data/Bird';
import { ShopController } from '../../controller/ShopController';
import { AudioController } from '../../controller/AudioController';
const { ccclass, property } = _decorator;

@ccclass('BirdBoxUI')
export class BirdBoxUI extends Component {
    @property(Sprite) birdSprite: Sprite;
    @property(Label) priceLabel: Label;

    private controller: ShopController;

    private bird: Bird = null;
    setUp(bird: Bird, controller: ShopController, isUsed: boolean = false) {
        this.bird = bird;
        this.birdSprite.spriteFrame = bird.spriteFrame;
        this.controller = controller;
        if (bird.isOwned) {
            this.priceLabel.string = "Owned";
        } else {
            this.priceLabel.string = bird.price.toString();
        }


        if (this.controller.usedBird.id == bird.id) {
            this.priceLabel.string = "Used";
        }

    }

    onButtonClick() {
        if (this.bird != null)
            AudioController.Instance.playTap();
        if (this.controller) {
            this.controller.buyBird(this.bird.id)
        }
    }
}


