import { _decorator, Component, find, log, Node } from 'cc';
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


    private ownedBirdIds: string[] = ["1weqww"];


    readonly USED_BIRD_ID: string = "USE_BIRD_ID";
    readonly OWNED_BIRD_ID: string = "OWNED_BIRD_ID"

    protected onEnable(): void {
        this.ownedBirdIds = JSON.parse(localStorage.getItem(this.OWNED_BIRD_ID)) ?? ["1weqww"]

        this.birdList.forEach(b => {
            if (this.ownedBirdIds.indexOf(b.id) !== -1) {
                b.isOwned = true;
            }
        })

        const storedId = localStorage.getItem(this.USED_BIRD_ID) ?? "1weqww";
        this.usedBird = this.birdList.find(b => b.id == storedId);

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

            this.ownedBirdIds.push(bird.id);
            localStorage.setItem(this.OWNED_BIRD_ID, JSON.stringify(this.ownedBirdIds))

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
        localStorage.setItem(this.USED_BIRD_ID, this.usedBird.id);
    }
}


