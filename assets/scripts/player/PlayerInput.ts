import { _decorator, Component, Input, Node, input, Camera, EventTouch, UITransform, Vec3, Vec2, math, view, CCFloat, log, tween, easing, NodeEventType } from 'cc';
import { GameController } from '../controller/GameController';
import { GameMode } from '../GameState';
const { ccclass, property } = _decorator;

@ccclass('PlayerInput')
export class PlayerInput extends Component {
    @property(Camera) mainCamera: Camera;
    @property(Node) canvas: Node;
    @property(CCFloat) private xRange: number = 150;
    @property(CCFloat) private moveSpeed: number = 10;
    @property(CCFloat) private threshold: number = 50;

    private isDragging: boolean = false;
    private inputX: number = 0;
    private targetPos: Vec3 = new Vec3();
    private startPos: Vec2;

    private lanes: number[] = [-120, 0, 120]
    private currentLaneIndex: number = 0;


    protected onLoad(): void {

        this.node.on(NodeEventType.TOUCH_START, this.OnNodeTouchStart, this)
        this.node.on(NodeEventType.TOUCH_END, this.OnNodeTouchEnd, this)
        this.node.on(NodeEventType.TOUCH_MOVE, this.OnNodeTouchMove, this)

        input.on(Input.EventType.TOUCH_START, this.OnTouchStart, this)
        input.on(Input.EventType.TOUCH_END, this.OnTouchEnd, this)

    }

    update(deltaTime: number) {
        this.moveByTouch();

    }

    private moveByTouch() {
        if (GameController.Instance.gameMode != GameMode.Default) return;
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


    private OnNodeTouchStart(event: EventTouch) {

    }

    private OnNodeTouchMove(event: EventTouch) {

        // const delta = event.getDelta();
        // let currentPos = this.node.getPosition();
        // log("delta: " + event.getDelta() + " |")
        // let clampDataX = math.clamp(delta.x, -30, 30);
        // let x = math.clamp(currentPos.x + clampDataX, -this.xRange, this.xRange)
        // this.node.setPosition(x, currentPos.y)
        if (GameController.Instance.gameMode != GameMode.Drag) return;

        const touchPos = event.getUILocation();

        const parentUITransform = this.node.parent!.getComponent(UITransform);
        const localPos = parentUITransform.convertToNodeSpaceAR(new Vec3(touchPos.x, touchPos.y, 0));

        const currentPos = this.node.getPosition();
        this.node.setPosition(math.clamp(localPos.x, -this.xRange, this.xRange), currentPos.y, currentPos.z);

    }

    private OnNodeTouchEnd(event: EventTouch) {

    }


    detectSwipe(endPos: Vec2) {
        if (GameController.Instance.gameMode != GameMode.Swipe) return;
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

    }



}


