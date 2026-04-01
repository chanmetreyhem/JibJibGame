import { _decorator, Collider2D, Component, Contact2DType, find, instantiate, IPhysics2DContact, log, Node, PhysicsGroup2D, PhysicsSystem2D, Prefab, randomRange, RigidBody2D, Vec3 } from 'cc';
import { GameController } from '../controller/GameController';
import { PlayerController } from './PlayerController';

const { ccclass, property } = _decorator;

@ccclass('PlayerCollisionHandler')
export class PlayerCollisionHandler extends Component {
    @property(Prefab) boomEffect: Prefab;
    @property(Prefab) coinEffect: Prefab;

    @property minDamage: number = 2;
    @property maxDamage: number = 10;

    private collider: Collider2D;

    readonly coinIndex: number = 1;
    readonly obstacleIndex: number = 2;

    private player: PlayerController = null

    protected onLoad(): void {

    }

    start() {
        this.player = this.getComponent(PlayerController)
        this.collider = this.getComponent(Collider2D)
        if (this.collider) {
            this.collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this)
        }
    }

    private onBeginContact(self: Collider2D, other: Collider2D, contact: IPhysics2DContact | null) {

        if (other.tag == this.coinIndex) {
            if (this.player != null) {
                this.player.AddCoin(+1)
                this.spawnEffect(this.coinEffect);
                this.scheduleOnce(() => {
                    other.node.destroy();
                }, 0);
            }



        } else if (other.tag == this.obstacleIndex) {

            this.spawnEffect(this.boomEffect);

            this.player.takeDamage(randomRange(this.minDamage, this.maxDamage))

            this.scheduleOnce(() => {
                other.node.destroy();
            }, 0);

        }

    }


    spawnEffect(effectPrefab: Prefab) {
        const effect = instantiate(effectPrefab);
        effect.setParent(find("Canvas"))
        effect.setPosition(new Vec3(this.node.position.x, this.node.position.y - 10))
        this.scheduleOnce(() => {
            effect.destroy();
        }, 1000);
    }


}



