import LSprite from '../plugin/lufylegend/display/LSprite';
import { common } from './common';
import LGlobal from '../plugin/lufylegend/utils/LGlobal';
import LBitmap from '../plugin/lufylegend/display/LBitmap';
import LBitmapData from '../plugin/lufylegend/display/LBitmapData';
import LEvent from '../plugin/lufylegend/events/LEvent';

/**
 * @author lufy
 */
class Background extends LSprite {
    constructor() {
        super();
        this.init();
    }
    init() {
        let self = this;
        self.back = new LBitmap(new LBitmapData(common.datalist['b_background'], 0, 0, 800, 480));
        self.backX = 0;
        self.addChild(self.back);
        self.grass = new LBitmap(new LBitmapData(common.datalist['m_background']));
        self.grass.y = LGlobal.height - self.grass.getHeight();
        self.addChild(self.grass);
        self.addEventListener(LEvent.ENTER_FRAME, self.onframe);
    }
    onframe(event) {
        let self = event.target;
        if (common.gameBody.isStop()) return;
		
        self.backX += common.MOVE_STEP * 0.1;
        if (self.backX > LGlobal.width) {
            self.backX -= LGlobal.width;
        }
        self.back.bitmapData.setCoordinate(self.backX, 0);
        self.grass.x -= common.MOVE_STEP * 0.5;
        if (self.grass.x + 960 < 0) {
            self.grass.x = LGlobal.width;
        }
    }
}
export default Background;