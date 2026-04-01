import { _decorator, CCFloat, Component, instantiate, Node, Prefab, randomRangeInt, Vec3, log, randomRange } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Level')
export class Level extends Component {
    @property(Prefab) coinPrefab: Prefab;
    @property(Prefab) boomPrefab: Prefab;
    @property(Prefab) airplanePrefab: Prefab;
    @property(CCFloat) speed: number = 10;
    @property(CCFloat) ySpace: number = 10;

    private lanes: number[] = [-120, 0, 120];
    private availableLanes: number[] = [0, 1, 2];

    private destroyY: number = -900;

    private coinChance: number = 0.8;
    private boomChance: number = 0.6;
    private airplaneChance: number = 0.8;

    private maxSpawn = 4;
    private minBoom = 5;


    protected start(): void {
        this.spawnCoin();
        this.spawnBoom();
        this.spawnAirplane();

    }

    private spawnCoin() {
        if (this.coinChance < this.randChange()) return;
        if (this.availableLanes.length <= 0) return;

        const x = this.lanes[this.selectLand()];

        const topStart = -60;
        const coinToSpawn = randomRangeInt(0, this.maxSpawn)


        for (let i = 0; i < coinToSpawn; i++) {

            const y = topStart + (i * 50) + (this.ySpace * i);
            const pos = new Vec3(x, y);

            this.spawn(this.coinPrefab, pos);
        }


    }

    private spawnBoom() {
        if (this.boomChance < this.randChange()) return;
        if (this.availableLanes.length <= 0) return;

        const x = this.lanes[this.selectLand()];


        const topStart = -60;
        const boomToSpawn = randomRangeInt(0, this.maxSpawn)


        for (let i = 0; i < boomToSpawn; i++) {

            const y = topStart + (i * 50) + (this.ySpace * i);
            const pos = new Vec3(x, y);

            this.spawn(this.boomPrefab, pos);
        }
    }

    private spawnAirplane() {
        if (this.airplaneChance < this.randChange()) return;
        if (this.availableLanes.length <= 0) return;

        const selectLand = this.selectLand();
        const pos = new Vec3(this.lanes[selectLand], 0);
        this.spawn(this.airplanePrefab, pos);
    }

    private spawn(prefab: Prefab, pos: Vec3) {
        const clone = instantiate(prefab);
        clone.setParent(this.node)
        clone.setPosition(pos);

    }

    update(deltaTime: number) {
        const pos = this.node.position
        this.node.setPosition(pos.x, pos.y - this.speed * deltaTime)
        if (this.node.position.y <= this.destroyY) {
            this.destroy();
        }
    }

    selectLand(): number {
        const randIndex = randomRangeInt(0, this.availableLanes.length);
        const selectLane = this.availableLanes[randIndex];
        this.availableLanes.splice(randIndex, 1);
        return selectLane;
    }

    randChange(): number { return randomRange(0, 1) }


    protected onDestroy(): void {
        log("level destroy!")
    }
}


