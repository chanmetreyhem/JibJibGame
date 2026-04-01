import { _decorator, Button, Color, Component, easing, find, Game, instantiate, Label, log, Node, Prefab, randomRange, Sprite, tween, UITransform, Vec2, Vec3, view } from 'cc';
import { GameController } from '../controller/GameController';
import { AudioController } from '../controller/AudioController';
const { ccclass, property } = _decorator;

@ccclass('GameOverScreen')
export class GameOverScreen extends Component {

    @property(Prefab) coinPrefab: Prefab;

    @property(Label) collectedCoinLabel: Label;

    @property(Node) endNode: Node;
    @property(Node) parentNode: Node;

    @property(Node) homeScreen: Node;
    @property(Node) homeButtonNode: Node;
    @property(Node) playAgainButtonNode: Node;

    @property(Button) claimButton: Button;

    @property(Color) disableColor: Color = null;

    private colletedCoin: number = 0;
    private posRange: number = 100;

    private duration: number = 1;
    start() {

        this.node.setPosition(new Vec3(0, -view.getVisibleSize().height + 200))
    }

    setUp(colletedCoin: number) {
        this.colletedCoin = colletedCoin;
        let isHaveCoin = colletedCoin > 0;

        this.claimButton.interactable = isHaveCoin;
        this.claimButton.getComponent(Sprite).color = isHaveCoin ? Color.WHITE : this.disableColor;
        this.homeButtonNode.active = this.playAgainButtonNode.active = false;
        if (!isHaveCoin) {
            this.showHomeAndAgainButton();
        }

        this.collectedCoinLabel.string = colletedCoin.toString();
    }

    active() {
        this.node.active = true;
        tween(this.node).to(this.duration, { position: new Vec3(0, 0, 0) }, { easing: easing.elasticInOut }).start()
    }

    inactive(onCompleted?: () => void) {

        tween(this.node)
            .to(this.duration, { position: new Vec3(0, -view.getVisibleSize().height + 200, 0) }, { easing: easing.elasticInOut })
            .call(() => {

                if (onCompleted) onCompleted();
                this.node.active = false;

            })
            .start()
    }

    onClimeButtonClick() {
        this.claimButton.interactable = false;

        this.claimButton.getComponent(Sprite).color = this.disableColor;
        // this.inactive();
        GameController.Instance.claimCoin();

        for (let i = 0; i < this.colletedCoin
            ; i++) {
            this.scheduleOnce(() => {
                this.clone();
                AudioController.Instance.playCollectedCoin();
            }, i * 0.1);
        }

        this.showHomeAndAgainButton();
    }

    onHomeButtonClick() {
        this.inactive(() => {
            this.homeScreen.active = true;
        });

    }
    
    onReplayButtonClick() {
        this.inactive(() => {
            GameController.Instance.startPlayGame();
        });

    }

    private showHomeAndAgainButton() {

        this.homeButtonNode.active = this.playAgainButtonNode.active = true;
        this.homeButtonNode.setScale(Vec3.ZERO);
        this.playAgainButtonNode.setScale(Vec3.ZERO);

        tween(this.homeButtonNode).to(this.duration, { scale: Vec3.ONE }, { easing: easing.bounceOutIn }).start()
        tween(this.playAgainButtonNode).to(this.duration, { scale: Vec3.ONE }, { easing: easing.bounceOutIn }).start()
    }


    clone(): void {
        const coinInstance = instantiate(this.coinPrefab);

        let spawnPos = this.claimButton.node.position;

        let localStartPos = new Vec3(spawnPos.x + randomRange(-this.posRange, this.posRange), spawnPos.y + randomRange(-this.posRange, this.posRange))

        coinInstance.setParent(find("Canvas"))
        coinInstance.setPosition(localStartPos);

        const localEndPos = this.parentNode.getComponent(UITransform)!.convertToNodeSpaceAR(this.endNode.getWorldPosition())
        this.moveCoin(coinInstance, localStartPos, localEndPos);

    }


    private moveCoin(node: Node, startPos: Vec3, endPos: Vec3) {


        const controlX = startPos.x + (Math.random() > 0.5 ? 150 : -150);
        const controlY = startPos.y + 100;
        const controlPos = new Vec3(controlX, controlY, 0);

        const tempPos = new Vec3();
        tween(node)
            .to(0.8, {}, {
                onUpdate: (target: Node, ratio: number) => {

                    const t = ratio;
                    const x = Math.pow(1 - t, 2) * startPos.x + 2 * (1 - t) * t * controlPos.x + Math.pow(t, 2) * endPos.x;
                    const y = Math.pow(1 - t, 2) * startPos.y + 2 * (1 - t) * t * controlPos.y + Math.pow(t, 2) * endPos.y;
                    tempPos.set(x, y, 0);
                    target.setPosition(tempPos);
                },
                easing: 'quadOut'
            })
            .call(() => {
                node.destroy();
                this.playCoinBoxAnim();
            })
            .start()
    }

    private playCoinBoxAnim() {
        tween(this.endNode)
            .to(0.05, { scale: new Vec3(1.2, 1.2, 1) })
            .to(0.05, { scale: new Vec3(1, 1, 1) })
            .call(() => AudioController.Instance.playCollectedCoin())
            .start();
    }
}


