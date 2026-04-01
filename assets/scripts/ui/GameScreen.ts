import { _decorator, Component, Label, Sprite } from 'cc';
import { GameController } from '../controller/GameController';
const { ccclass, property } = _decorator;

@ccclass('GameScreen')
export class GameScreen extends Component {

    @property(Label) coinLabel: Label;
    @property(Label) colletedCoinLabel: Label;
    @property(Sprite) healthProgress: Sprite;
    @property(Label) healthAmountLabel: Label;

    setUp(initCoin: number) {
        this.coinLabel.string = initCoin.toString();
    }

    protected onEnable(): void {
        GameController.Instance.onCollectedCoinChange = this.OnCollectedCoinChange.bind(this)
    }


    private OnCollectedCoinChange(amount: number) {
        this.colletedCoinLabel.string = amount.toString();
    }

    protected onDisable(): void {
        GameController.Instance.onCollectedCoinChange = null;
    }

    public onHealthProgressChange(progress: number, amount: number) {
        this.healthProgress.fillStart = progress;
        this.healthAmountLabel.string = Math.floor(amount).toString();
    }

    updateCoinLabel(amount: number) {
        this.coinLabel.string = amount.toString();
    }



}


