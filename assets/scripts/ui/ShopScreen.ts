import { _decorator, Component, instantiate, Label, Node, Prefab } from 'cc';
import { Bird } from '../data/Bird';
import { BirdBoxUI } from './components/BirdBoxUI';
import { ShopController } from '../controller/ShopController';
const { ccclass, property } = _decorator;

@ccclass('ShopScreen')
export class ShopScreen extends Component {
    @property(Node) parentNode: Node;
    @property(Prefab) birdBoxPrefab: Prefab;
    @property(Label) coinLabel: Label;

    active() {
        this.node.active = true;
    }
    inactive() {
        this.node.active = false;
    }

    updateShopGridUI(birds: Bird[], controller: ShopController) {
        if (this.parentNode.children.length > 0)
            this.parentNode.children.forEach(c => c.destroy());

        birds.forEach((b) => {
            const instance = instantiate(this.birdBoxPrefab);
            instance.setParent(this.parentNode);
            const birdBox = instance.getComponent(BirdBoxUI);
            birdBox.setUp(b, controller);
        })
    }

    updateCoinLabel(amount: number) {
        this.coinLabel.string = amount.toString();
    }
}


