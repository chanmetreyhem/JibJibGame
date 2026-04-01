import { _decorator, Component, Input, Node, input, Camera, EventTouch, UITransform, Vec3, Vec2, math, view, CCFloat, log, tween, easing } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PlayerInput')
export class PlayerInput extends Component {
    @property(Camera) mainCamera: Camera;
    @property(Node) canvas: Node;
    @property(CCFloat) moveSpeed: number = 10;
    private threshold: number = 50;
    private isDragging: boolean = false;
    private targetX: number = 0;
    private inputX: number = 0;
    private targetPos: Vec3 = new Vec3();


    private lanes: number[] = [-120, 0, 120]
    private currentLaneIndex: number = 0;


    protected onLoad(): void {
        input.on(Input.EventType.TOUCH_START, this.OnTouchStart, this)
        input.on(Input.EventType.TOUCH_END, this.OnTouchEnd, this)
    }

    update(deltaTime: number) {


    }

    private moveByTouch() {

        let currentXPos = this.node.position.x;
        currentXPos += this.moveSpeed * this.inputX;
        const xClam = math.clamp(currentXPos, -150, 150);
        this.node.setPosition(new Vec3(xClam, this.node.position.y));
    }

    protected onDisable(): void {
        input.off(Input.EventType.TOUCH_START, this.OnTouchStart, this)
        input.off(Input.EventType.TOUCH_END, this.OnTouchEnd, this)
    }

    private OnTouchStart(event: EventTouch) {
        this.isDragging = true;
        this.startPos = event.getLocation();
        const localPos = event.getLocation();
        // const wordToScreen = new Vec3;

        //  this.mainCamera.worldToScreen(new Vec3(localPos.x, localPos.y), wordToScreen)
        const screenWidth = view.getVisibleSize().width;

        if (localPos.x < screenWidth / 2) {
            this.inputX = -1
        } else if ((localPos.x > screenWidth / 2)) {
            this.inputX = 1;
        } else {
            this.inputX = 0;
        }

    }

    private OnTouchEnd(event: EventTouch) {
        this.isDragging = false;
        this.inputX = 0;
        const endPos = event.getLocation();
        this.detectSwipe(endPos);
    }

    private startPos: Vec2;
    detectSwipe(endPos: Vec2) {
        const deltaX = endPos.x - this.startPos.x;

        if (deltaX > this.threshold) {


            if (this.currentLaneIndex < this.lanes.length - 1) {
                this.currentLaneIndex += 1
            }
        } else if (deltaX < -this.threshold) {
            if (this.currentLaneIndex > 0) {
                this.currentLaneIndex -= 1;
            }
        }

        const startPos = this.node.getPosition();

        this.targetPos = new Vec3(this.lanes[this.currentLaneIndex], this.node.position.y)
        tween(this.node).to(0.2, { position: this.targetPos }, { easing: easing.sineInOut }).start()
        //this.node.setPosition(this.targetPos);
        log("index :" + this.currentLaneIndex)
        log(this.targetPos.toString());
    }



}


