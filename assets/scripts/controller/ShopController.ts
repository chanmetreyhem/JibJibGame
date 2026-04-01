import { _decorator, Component, log, Node } from 'cc';
import { ShopScreen } from '../ui/ShopScreen';
import { HomeScreen } from '../ui/HomeScreen';
import { Bird } from '../data/Bird';
import { GameController } from './GameController';
const { ccclass, property } = _decorator;

@ccclass('ShopController')
export class ShopController extends Component {








    @property({ type: [Bird] })
    public birdList: Bird[] = [];

    public usedBird: Bird = null;


    @property(ShopScreen) shopScreen: ShopScreen;
    @property(HomeScreen) homeScreen: HomeScreen;




    protected onEnable(): void {
        this.usedBird = this.birdList[0];
        this.homeScreen.updateUsedBirdSprite(this.usedBird.spriteFrame)
    }

    start() {
        GameController.Instance.birdSpriteFrame = this.usedBird.spriteFrame;
        this.shopScreen.updateShopGridUI(this.birdList, this);

        this.shopScreen.updateCoinLabel(GameController.Instance.UserCoin);

    }

    update(deltaTime: number) {

    }

    buyBird(id: string) {
        const bird = this.birdList.find(b => b.id == id);
        if (bird == null) {
            log("not found!")
            return;
        }
        if (bird.isOwned) {
            console.log("Already owned, equipping...");
            this.setUseBird(bird);
            this.shopScreen.updateShopGridUI(this.birdList, this);
            return;
        }
        let userCoin = GameController.Instance.UserCoin;
        if (userCoin >= bird.price) {
            userCoin -= bird.price;
            GameController.Instance.UserCoin = userCoin;
            bird.isOwned = true;
            this.shopScreen.updateShopGridUI(this.birdList, this);
            this.shopScreen.updateCoinLabel(userCoin);
            this.homeScreen.setUp(userCoin);

        } else {
            console.log("you don't have coin!")
        }
    }

    setUseBird(bird: Bird) {
        this.usedBird = bird;
        GameController.Instance.birdSpriteFrame = bird.spriteFrame;
        this.homeScreen.updateUsedBirdSprite(this.usedBird.spriteFrame)
    }
}


