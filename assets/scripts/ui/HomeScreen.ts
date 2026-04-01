import { _decorator, Component, director, Label, log, Node, Sprite, SpriteFrame } from 'cc';
import { GameController } from '../controller/GameController';
import { GameState } from '../GameState';
import { ShopScreen } from './ShopScreen';


const { ccclass, property } = _decorator;

@ccclass('HomeScreen')
export class HomeScreen extends Component {
    @property(Label) initCoinLabel: Label
    @property(Sprite) useBirdSprite: Sprite;
    @property(ShopScreen) shopScreen: ShopScreen


    setUp(initCoin: number) {
        this.initCoinLabel.string = initCoin.toString();
    }

    onPlayClick() {
        this.node.active = false;
        GameController.Instance.startPlayGame();

    }

    onShopButtonClick() {
        this.shopScreen.active();
    }

    reloadScene() {
        // Reload the currently active scene
        log("reload")
        // const currentScene = director.getScene();
        // if (currentScene) {
        director.loadScene("scene");
        //  }
    }

    updateCoinLabel(amount: number) {
        this.initCoinLabel.string = amount.toString();
    }

    updateUsedBirdSprite(spriteFrame: SpriteFrame) {
        this.useBirdSprite.spriteFrame = spriteFrame;
    }

}


