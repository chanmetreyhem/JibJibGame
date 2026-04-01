import { _decorator, Canvas, CCFloat, CCInteger, Component, find, instantiate, JsonAsset, Node, Prefab, randomRange, randomRangeInt, RigidBody2D, Vec2, Vec3 } from 'cc';
import { GameController } from './GameController';
import { GameState } from '../GameState';
const { ccclass, property } = _decorator;

@ccclass('SpawnController')
export class SpawnController extends Component {
    @property(Node) gameEnv: Node;
    @property(Prefab) coinPrefab: Prefab;
    @property(Prefab) boomPrefab: Prefab;
    @property(Node) spawnTransform: Node;

    @property(CCFloat) spawnCoinInterval: number = 2;
    @property(CCFloat) spawnBoomInterval: number = 1;

    @property(CCFloat) xRang: number = 150;
    @property(CCFloat) xForceRange: number = 100;
    @property(CCFloat) public downwardForce: number = 5000;
    @property(CCFloat) public torqueValue: number = 200;

    @property(CCFloat) public boomXForced: number = 200;
    @property(CCFloat) public coinXForced: number = 100;

    @property(CCInteger) private minCoinSpawn = 20;

    private coinSpawnTime: number = 0;
    private boomSpawnTime: number = 0;
    private coinSpawnCounter: number = 0;

    startGame() {

        this.coinSpawnCounter = 0;
        this.coinSpawnTime = this.spawnCoinInterval;
        this.boomSpawnTime = this.spawnBoomInterval;


    }

    update(deltaTime: number) {

        if (GameController.Instance.isGameOver || GameController.Instance.state == GameState.NotStart) return;

        this.coinSpawnTime -= deltaTime;
        this.boomSpawnTime -= deltaTime;

        this.spawnBoom();

        if (this.coinSpawnCounter > this.minCoinSpawn) return;

        this.spawnCoin();

    }

    private spawnCoin() {

        if (this.coinSpawnTime <= 0) {

            const coinInstant = this.spawnObject(this.coinPrefab);
            const rb = coinInstant.getComponent(RigidBody2D)
            rb.gravityScale = 0;

            this.applyForced(rb, this.coinXForced);

            this.coinSpawnTime = this.spawnCoinInterval;
            this.coinSpawnCounter += 1;
        }
    }

    private spawnBoom() {

        if (this.boomSpawnTime <= 0) {

            const randomAmountToSpawn = randomRangeInt(1, 4)

            for (let i = 0; i < randomAmountToSpawn; i++) {
                const boomInstant = this.spawnObject(this.boomPrefab);
                const rb = boomInstant.getComponent(RigidBody2D)

                rb.gravityScale = 0;
                this.applyForced(rb, this.boomXForced);
            }
            this.boomSpawnTime = this.spawnBoomInterval;
        }
    }

    private spawnObject(prefab: Prefab): Node {
        const instance = instantiate(prefab);
        instance.setParent(this.gameEnv);
        instance.setPosition(this.getRandomPosition());
        return instance;
    }
    private getRandomPosition(): Vec3 {
        const randomX = randomRange(-this.xRang, this.xRang);
        const y = this.spawnTransform.position.y;
        return new Vec3(randomX, y, 0)
    }

    private applyForced(rb: RigidBody2D, xRange: number) {
        if (rb) {
            rb.applyForceToCenter(new Vec2(randomRange(-xRange, xRange), -this.downwardForce), true);
            rb.applyTorque(this.torqueValue, true);
        }
    }
}


