import { _decorator, CCFloat, Component, director, Label, log, math, Node, PHYSICS_2D_PTM_RATIO, PhysicsSystem, PhysicsSystem2D, Vec2, instantiate, Enum, Prefab, Canvas, SpriteFrame } from 'cc';
import { GameState } from '../GameState';
import { GameOverScreen } from '../ui/GameOverScreen';
import { GameScreen } from '../ui/GameScreen';
import { PlayerController } from '../player/PlayerController';
import { HomeScreen } from '../ui/HomeScreen';
import { SpawnController } from './SpawnController';
import { RuntimeUI } from '../ui/RuntimeUI';
const { ccclass, property } = _decorator;

@ccclass('GameController')
export class GameController extends Component {
    private static instance: GameController;
    public static get Instance(): GameController {
        return this.instance;
    }
    @property(Node) gameCanvas: Node;

    @property(SpawnController) spawnController: SpawnController;

    @property(RuntimeUI) ui: RuntimeUI;



    @property(Prefab) playerPrefab: Prefab = null;
    @property(Node) playerSpawnPos: Node;


    @property(CCFloat) private minGravity = 9.8;
    @property(CCFloat) private maxGravity = 20;
    @property(CCFloat) private gameTime = 60;


    @property(Label) timeLabel: Label;
    @property({ type: Enum(GameState) }) public state: GameState = GameState.NotStart

    setGameState(state: GameState) {
        this.state = state;
    }

    @property(SpriteFrame) defaultBirdSpriteFrame: SpriteFrame;
    @property(SpriteFrame) public birdSpriteFrame: SpriteFrame = null;

    @property(Node) private playerInstance: Node = null;
    private colletedCoin: number = 0;
    private initializeCoin: number = 100;

    public get UserCoin(): number {
        return this.initializeCoin;
    }
    public set UserCoin(value: number) {
        this.initializeCoin = value;
    }

    private time: number = 0;

    public onCollectedCoinChange: ((amount: number) => void) = null;
    public isGameOver: boolean = false;

    protected onLoad(): void {
        this.Initialize();
    }

    private Initialize() {
        GameController.instance = this;
    }
    protected onEnable(): void {

    }

    start() {

        this.ui.homeScreen.setUp(this.initializeCoin);

    }

    update(deltaTime: number) {

        if (this.state == GameState.NotStart) return;
        if (this.time <= 0 || this.isGameOver) return;

        if (this.state == GameState.Start) {
            this.time -= deltaTime;
            this.timeLabel.string = Math.max(0, Math.floor(this.time)).toString();

            let progress = 1 - (this.time / this.gameTime);
            let currentGravity = math.lerp(this.minGravity, this.maxGravity, progress)
            this.setUpGravity(currentGravity);

            if (this.time <= 0) {


                this.gameOver();

            }
        }

    }
    protected onDisable(): void {

    }

    protected onDestroy(): void {

    }
    startPlayGame() {

        log("Start Game");
        this.ui.gameScreen.node.active = true;

        // if (this.playerInstance != null) {
        //     this.playerInstance.destroy();
        //     this.playerInstance = null;
        // }

        this.time = this.gameTime;
        PhysicsSystem2D.instance.enable = true;
        this.setUpGravity(this.minGravity);


        this.spawnPlayer();
        this.isGameOver = false;
        this.state = GameState.Start;

        this.spawnController.startGame();
    }

    spawnPlayer() {

        this.playerInstance = instantiate(this.playerPrefab);
        this.playerInstance.setParent(this.gameCanvas);
        this.playerInstance.setPosition(this.playerSpawnPos.position);

        const playerController = this.playerInstance.getComponent(PlayerController);
        playerController.setUp(this.ui.gameScreen, this.birdSpriteFrame != null ? this.birdSpriteFrame : this.defaultBirdSpriteFrame);

        this.ui.gameScreen.setUp(this.initializeCoin);

    }

    gameOver() {

        this.state = GameState.Ended;
        this.isGameOver = true;

        if (this.playerInstance != null) {
            //log("not null")
            this.playerInstance.destroy();
        }
        this.ui.gameOverScreen.active();
        this.ui.gameOverScreen.setUp(this.colletedCoin);

    }


    updateColletedCoinUI(amount: number) {
        this.colletedCoin = amount;
        this.onCollectedCoinChange(amount);
    }

    claimCoin() {
        this.initializeCoin += this.colletedCoin;
        this.colletedCoin = 0;
        this.updateUI();
    }

    private setUpGravity(gravity: number) {
        PhysicsSystem2D.instance.gravity = new Vec2(0, gravity * PHYSICS_2D_PTM_RATIO);
    }

    private updateUI() {
        this.ui.updateCoinLabel(this.initializeCoin);
    }
}



