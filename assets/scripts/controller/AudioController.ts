import { _decorator, Component, Node, director, AudioSource, AudioClip, find, Button, NodeEventType, Canvas } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AudioController')
export class AudioController extends Component {
    private static instance: AudioController;
    public static get Instance(): AudioController {
        return this.instance;
    }

    @property(Canvas) canvas: Canvas;

    @property(AudioSource) musicSource: AudioSource;
    @property(AudioSource) sfxSource: AudioSource;

    @property(AudioClip) tapClip: AudioClip;
    @property(AudioClip) explosionClip: AudioClip;
    @property(AudioClip) coinCollectedClip: AudioClip;

    @property([Button])
    public buttons: Button[] = [];

    protected onLoad(): void {
        AudioController.instance = this;

    }

    protected start(): void {

        this.buttons = this.canvas.getComponentsInChildren(Button);
        if (this.buttons.length > 0) {
            this.buttons.forEach(b => {
                b.node.on(NodeEventType.TOUCH_START, this.OnTap, this)
            });
        }

        this.musicSource.play();

    }


    muteMusic(isMute: boolean) {
        this.musicSource.volume = isMute ? 0 : 0.5;
    }

    muteSfx(isMute: boolean) {
        this.sfxSource.volume = isMute ? 0 : 1;
    }

    playerSfx(clip: AudioClip) {
        this.sfxSource.playOneShot(clip);
    }

    public playExplosion() {
        this.playerSfx(this.explosionClip);
    }
    public playCollectedCoin() {
        this.playerSfx(this.coinCollectedClip);
    }
    public playTap(){
        this.playerSfx(this.tapClip);
    }

    private OnTap() {
        this.playerSfx(this.tapClip)
    }



}


