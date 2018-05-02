import LSprite from '../plugin/lufylegend/display/LSprite';
import LGlobal from '../plugin/lufylegend/utils/LGlobal';
import LBitmap from '../plugin/lufylegend/display/LBitmap';
import LBitmapData from '../plugin/lufylegend/display/LBitmapData';
import { common } from './common';
import LEvent from '../plugin/lufylegend/events/LEvent';
import Npc from './Npc';

/**
 * @author lufy
 */
class Floor extends LSprite {
    constructor(index) {
        super();
        this.init(index);
    }
    init(index) {
        let self = this;
        self.isOutComplete = false;
        self.x = LGlobal.width;
        self.y = 32 * 6 + 32 * (8 * Math.random() >>> 0);
        self.isStart = false;
        let bitmap, rightBitmap;
        switch (index) {
        case 1:
            bitmap = new LBitmap(new LBitmapData(common.datalist['stage'], 0, 0, 32 * (3 + (19 * Math.random() >>> 0)), 96));
            bitmap.y = -32;
            self.addChild(bitmap);
            break;
        default:
            self.isStart = true;
            bitmap = new LBitmap(new LBitmapData(common.datalist['stage'], 0, 0, 960, 96));
            bitmap.y = -32;
            self.addChild(bitmap);
            rightBitmap = true;
            break;
        }
        if (!rightBitmap) {
            rightBitmap = new LBitmap(new LBitmapData(common.datalist['stage'], 32 * 29, 0, 32, 96));
            rightBitmap.x = bitmap.getWidth();
            rightBitmap.y = -32;
            self.addChild(rightBitmap);
        }
        self.maxRight = LGlobal.width - 32 * 2 - 32 * (10 * Math.random() >>> 0);
        self.right = self.getWidth();
        self.bottom = 32 * 2;
        Npc.add(self);
        self.addEventListener(LEvent.ENTER_FRAME, self.onframe);
    }
    onframe(event) {
        let self = event.target;
        if (common.gameBody.isStop()) return;
        self.x -= common.MOVE_STEP;
        if (!self.isOutComplete && self.x + self.getWidth() < self.maxRight) {
            self.isOutComplete = true;
            self.dispatchEvent(Floor.OUT_COMPLETE);
        } else if (self.x + self.getWidth() < 0) {
            self.dispatchEvent(Floor.OUT_DIE);
            self.die();
        }
    }
    checkHitTestPoint(x, y) {
        let self = this;
        if (x > self.x && x < self.x + self.right && y > self.y && y < self.y + self.bottom) {
            return true;
        }
        return false;
    }
}
Floor.OUT_COMPLETE = 'floor_out_complete';
Floor.OUT_DIE = 'floor_out_die';
export default Floor;