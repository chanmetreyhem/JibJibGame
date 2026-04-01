import { _decorator, Button, Component, director, easing, Node, Sprite, SpriteFrame, tween, Vec3 } from 'cc';
import { Setting } from '../utils/Setting';
import { AudioController } from '../controller/AudioController';
const { ccclass, property } = _decorator;

@ccclass('SettingScreen')
export class SettingScreen extends Component {
    @property(Node) panel: Node;

    @property(Button) settingButton: Button;

    @property(Sprite) musicButtonSprite: Sprite;
    @property(Sprite) sfxButtonSprite: Sprite;

    @property(SpriteFrame) muteFrame: SpriteFrame;
    @property(SpriteFrame) unMuteFrame: SpriteFrame

    private isMuteMusic: boolean = false;
    private isMuteSfx: boolean = false;

    readonly MUSIC_KEY = "MUSIC";
    readonly SFX_KEY = "SFX";


    protected start(): void {
        this.isMuteMusic = localStorage.getItem(this.MUSIC_KEY) === "true";
        this.isMuteSfx = localStorage.getItem(this.SFX_KEY) === "true";

        this.sfxButtonSprite.spriteFrame = this.isMuteSfx ? this.muteFrame : this.unMuteFrame;
        this.musicButtonSprite.spriteFrame = this.isMuteMusic ? this.muteFrame : this.unMuteFrame;

        AudioController.Instance.muteMusic(this.isMuteMusic);
        AudioController.Instance.muteSfx(this.isMuteSfx);
    }


    active(onCompleted?: any) {
        this.panel.active = true;
        this.panel.setScale(Vec3.ZERO)
        tween(this.panel).
            to(Setting.duration, { scale: Vec3.ONE }, { easing: easing.smooth })
            .call(() => {
                if (onCompleted) onCompleted();
            })
            .start();

    }

    toggleSfx() {
        this.isMuteSfx = !this.isMuteSfx;
        AudioController.Instance.muteSfx(this.isMuteSfx);
        this.sfxButtonSprite.spriteFrame = this.isMuteSfx ? this.muteFrame : this.unMuteFrame;

        localStorage.setItem(this.SFX_KEY, this.isMuteSfx.toString())

    }

    toggleMusic() {
        this.isMuteMusic = !this.isMuteMusic;
        AudioController.Instance.muteMusic(this.isMuteMusic);
        this.musicButtonSprite.spriteFrame = this.isMuteMusic ? this.muteFrame : this.unMuteFrame;

        localStorage.setItem(this.MUSIC_KEY, this.isMuteMusic.toString())

    }

    inactive(onCompleted?: any) {
        tween(this.panel).
            to(Setting.duration, { scale: Vec3.ZERO }, { easing: easing.smooth })
            .call(() => {
                if (onCompleted) onCompleted();
                this.panel.active = false;
            })
            .start();
    }

    onCrossButtonClick() {
        this.inactive(() => {
            this.settingButton.interactable = true;

        });
    }
    onSettingButtonClick() {
        this.active(() => {
            this.settingButton.interactable = false

        });

    }


}


