import LSprite from '../plugin/lufylegend/display/LSprite';
import LBitmap from '../plugin/lufylegend/display/LBitmap';
import LBitmapData from '../plugin/lufylegend/display/LBitmapData';
import { common } from './common';

/**
 * @author lufy
 */
class Star extends LSprite {
    constructor() {
        super();
        this.init();
    }
    init() {
        let self = this;
        let Star_bg = new LBitmap(new LBitmapData(common.datalist['stage'], 32 * 9, 32 * 4, 32 * 5, 32));
        self.addChild(Star_bg);
        self.value = 0;
        self.maxValue = 50;
        self.Star_value = new LBitmap(new LBitmapData(common.datalist['stage'], 32 * 9, 32 * 3, 32 * 5, 32));
        self.addChild(self.Star_value);
        self.changeValue(49);
    }
    changeValue(value) {
        let self = this;
        self.value += value;
        self.Star_value.visible = true;
        if (self.value < 0) {
            self.value = 0;
            self.Star_value.visible = false;
            return;
        } else if (self.value > self.maxValue) {
            self.value = self.maxValue;
        }
        if (!common.gameBody || !common.gameBody.character) {
            return;
        }
        let runCharacter = common.gameBody.character;
        self.Star_value.bitmapData.setProperties(32 * 9, 32 * 3, 32 * 5 * self.value / self.maxValue, 32);
        if (self.value === self.maxValue && !runCharacter.invincible()) {
            runCharacter.spiritCount = 4;
            runCharacter.hero.stop();
            runCharacter.spiritStart();
        }
    }
}
export default Star;