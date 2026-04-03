import { _decorator, Button, Color, Component, director, easing, Label, Node, Sprite, SpriteFrame, tween, Vec3 } from 'cc';
import { Setting } from '../utils/Setting';
import { AudioController } from '../controller/AudioController';
import { GameMode } from '../GameState';
import { GameController } from '../controller/GameController';
const { ccclass, property } = _decorator;

@ccclass('SettingScreen')
export class SettingScreen extends Component {
    @property(Node) panel: Node;

    @property(Button) settingButton: Button;

    @property(Sprite) musicButtonSprite: Sprite;
    @property(Sprite) sfxButtonSprite: Sprite;

    @property(SpriteFrame) muteFrame: SpriteFrame;
    @property(SpriteFrame) unMuteFrame: SpriteFrame

    @property(SpriteFrame) usedButtonSpriteFrame: SpriteFrame;
    @property(SpriteFrame) defaultButtonSpriteFrame: SpriteFrame

    @property(Color) usedColor: Color = null;
    @property(Color) defaultColor: Color = null;

    @property(Button) defaultButton: Button;
    @property(Button) swipeButton: Button;
    @property(Button) dragButton: Button;
    @property(Button) physicButton: Button;
    @property(Button) speedButton: Button;


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

        switch (GameController.Instance.GameMode) {
            case GameMode.Swipe:
                this.onSwipeButtonClick();
                break;
            case GameMode.Drag:
                this.onDragButtonClick();
                break;
            default: this.onDefaultButtonClick();
                break;
        }

        GameController.Instance.IsFallByGravity ? this.onPhysicButtonClick() : this.onSpeedButtonClick();
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


    onDefaultButtonClick() {
        GameController.Instance.GameMode = GameMode.Default;

        this.updateButton(this.defaultButton, true);
        this.updateButton(this.swipeButton, false);
        this.updateButton(this.dragButton, false);


    }
    onSwipeButtonClick() {
        GameController.Instance.GameMode = GameMode.Swipe;
        this.updateButton(this.defaultButton, false);
        this.updateButton(this.swipeButton, true);
        this.updateButton(this.dragButton, false);
    }
    onDragButtonClick() {
        GameController.Instance.GameMode = GameMode.Drag;
        this.updateButton(this.defaultButton, false);
        this.updateButton(this.swipeButton, false);
        this.updateButton(this.dragButton, true);
    }

    onPhysicButtonClick() {
        GameController.Instance.IsFallByGravity = true;
        this.updateButton(this.physicButton, true);
        this.updateButton(this.speedButton, false);

    }
    onSpeedButtonClick() {

        GameController.Instance.IsFallByGravity = false;

        this.updateButton(this.physicButton, false);
        this.updateButton(this.speedButton, true);
    }

    updateButton(button: Button, isUsed: boolean) {
        button.getComponent(Sprite).spriteFrame = isUsed ? this.usedButtonSpriteFrame : this.defaultButtonSpriteFrame;
        button.getComponentInChildren(Label).color = isUsed ? this.usedColor : this.defaultColor;
    }


}


