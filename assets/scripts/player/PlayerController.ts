import { _decorator, Component, easing, Label, randomRange, Sprite, SpriteFrame, tween, Vec2, Vec3 } from 'cc';
import { GameController } from '../controller/GameController';
import { HomeScreen } from '../ui/HomeScreen';
import { GameScreen } from '../ui/GameScreen';
import { AudioController } from '../controller/AudioController';
const { ccclass, property } = _decorator;

@ccclass('PlayerController')
export class PlayerController extends Component {

    @property(Sprite) modelSprite: Sprite;
    @property(Label) minusHeartLabel: Label;
    @property startHealth: number = 100;
    private colletedCoin: number = 0;
    private health: number = 0;
    private ui: GameScreen = null;



    protected onEnable(): void {

    }
    setUp(ui: GameScreen, model: SpriteFrame) {
        this.modelSprite.spriteFrame = model;
        this.health = this.startHealth;
        this.ui = ui;
        GameController.Instance.updateColletedCoinUI(this.colletedCoin)
        if (this.ui != null) this.ui.onHealthProgressChange(1, 100)
    }


    public AddCoin(amount: number) {
        AudioController.Instance.playCollectedCoin();
        this.colletedCoin += amount;

        GameController.Instance.updateColletedCoinUI(this.colletedCoin)
    }

    public takeDamage(damage: number) {
        if (this.health <= 0) return;

        AudioController.Instance.playExplosion();

        this.health -= damage;
        const progress = this.health / this.startHealth;
        
        this.updateMinusHeartLabel(damage)

        if (this.health <= 0) {
            this.health = 0;
            GameController.Instance.gameOver()
            this.die();
        }

        if (this.ui != null) this.ui.onHealthProgressChange(this.health / this.startHealth, this.health)


    }


    die() {
        this.scheduleOnce(() => {
            this.node.destroy();
        }, 0)
    }

    updateMinusHeartLabel(amount: number) {
        this.minusHeartLabel.node.active = true;
        this.minusHeartLabel.node.setScale(Vec3.ZERO);
        this.minusHeartLabel.node.setPosition(Vec3.ZERO);

        this.minusHeartLabel.string = "-" + Math.floor(amount).toString();

        const x = randomRange(-50, 50);
        const y = randomRange(55, 75);
        const pos = new Vec3(x, y);
        const randScale = randomRange(0.5, 0.8)
        const scale = new Vec3(randScale, randScale)
        tween(this.minusHeartLabel.node).to(0.2, {
            position: pos, scale: scale
        }, { easing: easing.elasticIn })
            .call(() => {
                this.scheduleOnce(() => this.minusHeartLabel.node.active = false, 0.2)
            })
            .start()
    }

}


