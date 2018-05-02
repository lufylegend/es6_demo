import LSprite from '../plugin/lufylegend/display/LSprite';
import LBitmap from '../plugin/lufylegend/display/LBitmap';
import LBitmapData from '../plugin/lufylegend/display/LBitmapData';
import { common } from './common';

/**
 * @author lufy
 */
class HP extends LSprite {
    constructor() {
        super();
        this.init();
    }
    init() {
        let self = this;
        let HP_bg = new LBitmap(new LBitmapData(common.datalist['HP_bg']));
        HP_bg.x = -15;
        HP_bg.y = -2;
        self.addChild(HP_bg);
        self.value = self.maxValue = 100;
        self.HP_value = new LBitmap(new LBitmapData(common.datalist['HP_value']));
        self.addChild(self.HP_value);
    }
    changeValue(value) {
        let self = this;
        self.value += value;
        if (self.value < 1) {
            self.value = 1;
        } else if (self.value > 100) {
            self.value = 100;
        }
        self.HP_value.scaleX = self.value / self.maxValue;
    }
}
export default HP;