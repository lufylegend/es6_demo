import LSprite from '../plugin/lufylegend/display/LSprite';
import LBitmap from '../plugin/lufylegend/display/LBitmap';
import LBitmapData from '../plugin/lufylegend/display/LBitmapData';
import { common } from './common';

/**
 * @author lufy
 */
class Num extends LSprite {
    constructor(direction) {
        super();
        this.init(direction);
    }
    init(direction) {
        let self = this;
        self.direction = direction;
        self.dataList = [
            new LBitmapData(common.datalist['num_0']),
            new LBitmapData(common.datalist['num_1']),
            new LBitmapData(common.datalist['num_2']),
            new LBitmapData(common.datalist['num_3']),
            new LBitmapData(common.datalist['num_4']),
            new LBitmapData(common.datalist['num_5']),
            new LBitmapData(common.datalist['num_6']),
            new LBitmapData(common.datalist['num_7']),
            new LBitmapData(common.datalist['num_8']),
            new LBitmapData(common.datalist['num_9'])
        ];
        self.list = [];
        self.setValue(0);
    }
    setValue(value) {
        let self = this;
        self.value = value;
        let strValue = self.value.toString(), numBitmap;
        if (self.childList.length !== strValue.length) {
            self.setList(strValue.length);
        }
		
        for (let i = 0, l = strValue.length;i < l;i++) {
            numBitmap = self.childList[i];
            numBitmap.bitmapData = self.dataList[parseInt(strValue.charAt(i))];
        }
    }
    setList(length) {
        let self = this;
        if (self.childList.length > length) {
            self.childList.splice(length - 1, self.childList.length - length);
            return;
        }
        let sx, numBitmap;
        if (self.direction === Num.LEFT) {
            sx = -length * 20;
        } else {
            sx = -20;
        }
        for (let i = 0, l = length;i < l;i++) {
            if (i >= self.childList.length) {
                numBitmap = new LBitmap(self.dataList[0]);
                self.addChild(numBitmap);
            }
            numBitmap = self.childList[i];
            sx += 20;
            numBitmap.x = sx;
        }
    }
}
Num.LEFT = 'num_left';
Num.RIGHT = 'num_right';
export default Num;