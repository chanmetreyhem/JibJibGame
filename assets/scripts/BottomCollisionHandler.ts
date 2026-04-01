import { _decorator, Collider2D, Component, Contact2DType, IPhysics2DContact, log, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BottomCollisionHandler')
export class BottomCollisionHandler extends Component {
    private collider: Collider2D;
    start() {
        this.collider = this.getComponent(Collider2D)
        if (this.collider) {
            this.collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this)
        }
    }

    private onBeginContact(self: Collider2D, other: Collider2D, contact: IPhysics2DContact | null) {
        this.scheduleOnce(() => {
            // log("Bottom handle destroy: " + other.node.name)
            other.node.destroy();
        }, 0);

    }
}


