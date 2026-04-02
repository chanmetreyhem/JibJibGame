import { _decorator, CCFloat, CCInteger, Component, instantiate, log, Node, Prefab } from 'cc';
import { GameState } from '../GameState';
import { GameController } from '../controller/GameController';
const { ccclass, property } = _decorator;

@ccclass('LevelGenerator')
export class LevelGenerator extends Component {
    @property(Node) startPositionNode: Node;
    @property(Prefab) levelPrefab: Prefab;

    @property(CCFloat) interval: number = 2;

    @property(CCInteger) size: number = 10;
    private time: number = 0;
    start() {
        this.time = this.interval;
    }

    update(deltaTime: number) {

        if (GameController.Instance.IsFallByGravity === true) return;
        if (GameController.Instance.isGameOver || GameController.Instance.state == GameState.NotStart) return;
        log("level : " + GameController.Instance.IsFallByGravity.toString())
        this.time -= deltaTime;
        if (this.time < 0) {
            this.spawnLevel();
            this.time = this.interval;
        }
    }

    spawnLevel() {
        const instance = instantiate(this.levelPrefab);
        instance.setParent(this.node);
        instance.setPosition(this.startPositionNode.position);
    }
}


