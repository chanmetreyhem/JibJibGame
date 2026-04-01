import { _decorator, Component, Node } from 'cc';
import { HomeScreen } from './HomeScreen';
import { ShopScreen } from './ShopScreen';
import { SettingScreen } from './SettingScreen';
import { GameOverScreen } from './GameOverScreen';
import { GameScreen } from './GameScreen';

const { ccclass, property } = _decorator;

@ccclass('RuntimeUI')
export class RuntimeUI extends Component {
    @property(HomeScreen) homeScreen: HomeScreen;
    @property(GameScreen) gameScreen: GameScreen;
    @property(ShopScreen) shopScreen: ShopScreen;
    @property(SettingScreen) settingScreen: SettingScreen;
    @property(GameOverScreen) gameOverScreen: GameOverScreen;

    updateCoinLabel(amount: number) {
        this.homeScreen.updateCoinLabel(amount);
        this.shopScreen.updateCoinLabel(amount);
        this.gameScreen.updateCoinLabel(amount);
    }
}


