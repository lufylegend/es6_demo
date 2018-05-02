import LSprite from '../plugin/lufylegend/display/LSprite';
import LBitmap from '../plugin/lufylegend/display/LBitmap';
import LBitmapData from '../plugin/lufylegend/display/LBitmapData';
import { common } from './common';
import LEvent from '../plugin/lufylegend/events/LEvent';
import Character from './Character';
import LTweenLite from '../plugin/lufylegend/transitions/LTweenLite';
import LEasing from '../plugin/lufylegend/transitions/LEasing';
/**
 * @author lufy
 */
class Item extends LSprite {
    constructor(name) {
        super();
        this.init(name);
    }
    init(name) {
        let self = this;
        self.name = name;
        if (self.name === 'star') {
            self.bitmap = new LBitmap(new LBitmapData(common.datalist['stage'], 32 * 9, 32 * 3, 32, 32));
        } else if (self.name === 'speed') {
            self.bitmap = new LBitmap(new LBitmapData(common.datalist['stage'], 32 * 14, 32 * 3, 40, 48));
            self.bitmap.x = -1;
            self.bitmap.y = -8;
        } else if (self.name === 'solution') {
            self.bitmap = new LBitmap(new LBitmapData(common.datalist['stage'], 32 * 16, 32 * 3, 40, 48));
            self.bitmap.x = -4;
            self.bitmap.y = -8;
        }
		
        self.mode = Item.MODE_LIVE;
        self.addChild(self.bitmap);
        self.addEventListener(LEvent.ENTER_FRAME, self.onframe);
    }
    onframe(event) {
        let self = event.target;
        if (common.gameBody.isStop()) return;
        if (self.mode === Item.MODE_LIVE) {
            self.checkHit();
        }
        self.x -= common.MOVE_STEP;
    }
    checkHit() {
        let self = this;
        if (self.x < -96) return;
        let runCharacter = common.gameBody.character;
        if (runCharacter.rect.action !== Character.HERT) {
            let ix = self.x > (runCharacter.x + runCharacter.rect.x) ? self.x : (runCharacter.x + runCharacter.rect.x);
            let iy = self.y > (runCharacter.y + runCharacter.rect.y) ? self.y : (runCharacter.y + runCharacter.rect.y);
            let ax = (self.x + 32) > (runCharacter.x + runCharacter.rect.x + runCharacter.rect.width) ? (runCharacter.x + runCharacter.rect.x + runCharacter.rect.width) : (self.x + 32);
            let ay = (self.y + 32) > (runCharacter.y + runCharacter.rect.y + runCharacter.rect.height) ? (runCharacter.y + runCharacter.rect.y + runCharacter.rect.height) : (self.y + 32);
            if (ix <= ax && iy <= ay) {
                if (self.name === 'star') {
                    common.gameBody.starCtrl.changeValue(1);
                } else if (self.name === 'speed') {
                    common.gameBody.moveStepCount = 200;
                    common.gameBody.speedBitmap.visible = true;
                    common.MOVE_STEP = common.MOVE_STEP_FAST;
                } else if (self.name === 'solution') {
                    runCharacter.hp.changeValue(20);
                }
                //MySoundPlayer.playSound('get');
                self.mode = Item.MODE_GET;
                LTweenLite.to(self.bitmap, 0.2, { y: -10, scaleX: 0.1, alpha: 0.75, ease: LEasing.None })
                    .to(self.bitmap, 0.2, { y: -20, scaleX: 1, alpha: 0.5, ease: LEasing.None })
                    .to(self.bitmap, 0.2, { y: -30, scaleX: 0.1, alpha: 0.25, ease: LEasing.None })
                    .to(self.bitmap, 0.2, { y: -40, scaleX: 1, alpha: 0, ease: LEasing.None });
            }
        }
    }
}
Item.MODE_LIVE = 'live';
Item.MODE_GET = 'get';
Item.MODE_DELETE = 'delete';
Item.add = function(floor) {
    let item, i;
    let randNum = Math.random();
    if (randNum > 0.7) {
        return;
    }
    let maxnum = floor.getWidth() / 32 >>> 0, addnum;
    if (maxnum > 5) {
        addnum = 5 + ((maxnum - 5) * Math.random() >>> 0);
    } else {
        addnum = maxnum;
    }
    let sx = floor.x + (floor.getWidth() - addnum * 32) * 0.5;
    let specialItem = false;
    for (i = 0;i < addnum;i++) {
        if (i % 2 === 0) continue;
        randNum = Math.random();
        if (randNum > 0.95 && !specialItem) {
            specialItem = true;
            item = new Item('speed');
        } else if (randNum > 0.9 && !specialItem) {
            specialItem = true;
            item = new Item('solution');
        } else {
            item = new Item('star');
        }
        item.x = sx + i * 32;
        item.y = floor.y - 32;
        common.gameBody.itemLayer.addChild(item);
    }
};
export default Item;