import LSprite from '../plugin/lufylegend/display/LSprite';
import Background from './Background';
import LBitmap from '../plugin/lufylegend/display/LBitmap';
import LBitmapData from '../plugin/lufylegend/display/LBitmapData';
import { common } from './common';
import Star from './Star';
import HP from './HP';
import Character from './Character';
import Num from './Num';
import LGlobal from '../plugin/lufylegend/utils/LGlobal';
import LMouseEvent from '../plugin/lufylegend/events/LMouseEvent';
import LEvent from '../plugin/lufylegend/events/LEvent';
import GameOver from './GameOver';
import Map from './Map';
/**
 * @author lufy
 */
class GameBody extends LSprite {
    constructor() {
        super();
        this.init();
    }
    init() {
        let self = this;
        self.moveStepCount = 0;
        self.gameover = false;
        let background = new Background();
        self.addChild(background);
		
        self.speedBitmap = new LBitmap(new LBitmapData(common.datalist['stage'], 32 * 14, 32 * 3, 40, 48));
        self.speedBitmap.x = 32;
        self.speedBitmap.y = 30;
        self.speedBitmap.visible = false;
        self.addChild(self.speedBitmap);
		
        let itemLayer = new LSprite();
        this.itemLayer = itemLayer;
        let npcLayer = new LSprite();
        this.npcLayer = npcLayer;
        let runMap = new Map();
        this.runMap = runMap;
        self.addChild(runMap);
		
        self.addChild(itemLayer);
        self.addChild(npcLayer);
		
		
        let hp = new HP();
        hp.x = 16;
        hp.y = 10;
        let runCharacter = new Character(hp);
        runCharacter.x = 32 * 8;
        runCharacter.y = 32 * 4;
        runCharacter.setRect();
        self.addChild(runCharacter);
        self.character = runCharacter;
		
        let starCtrl = new Star();
        starCtrl.x = 32 + hp.getWidth();
        starCtrl.y = 2;
        this.starCtrl = starCtrl;
		
        self.addChild(hp);
        self.addChild(starCtrl);
		
        let num = new Num(Num.LEFT);
        num.x = LGlobal.width - 32;
        num.y = 32;
        self.addChild(num);
        runCharacter.distanceObj = num;
		
        self.stopBitmapData = new LBitmapData(common.datalist['stage'], 32 * 23, 32 * 3, 64, 64);
        self.playBitmapData = new LBitmapData(common.datalist['stage'], 32 * 25, 32 * 3, 64, 64);
        self.stopBitmap = new LBitmap(self.stopBitmapData);
        self.stopBitmap.x = 16;
        self.stopBitmap.y = LGlobal.height - 64 - 16;
        self.addChild(self.stopBitmap);
		
		
        self.addEventListener(LMouseEvent.MOUSE_UP, self.mouseup);
        self.addEventListener(LMouseEvent.MOUSE_DOWN, self.mousedown);
        self.addEventListener(LEvent.ENTER_FRAME, self.onframe);
    }
    isStop() {
        if (common.stopFlag || common.gameBody.character.spiritCount > 0) {
            return true;
        }
        return false;
    }
    onframe(event) {
        let self = event.target, child, i, l;
        if (common.gameBody.isStop()) return;
        if (common.MOVE_STEP === common.MOVE_STEP_FAST) {
            if (self.moveStepCount-- <= 0 && !common.gameBody.character.invincible()) {
                common.MOVE_STEP = common.MOVE_STEP_SLOW;
                self.speedBitmap.visible = false;
            }
        }
	
        for (i = 0, l = common.gameBody.npcLayer.childList.length;i < l;i++) {
            child = common.gameBody.npcLayer.childList[i];
            if (child.x < -96) {
                child.remove();
                i--;
                l--;
            }
        }
        for (i = 0, l = common.gameBody.itemLayer.childList.length;i < l;i++) {
            child = common.gameBody.itemLayer.childList[i];
            if (child.x < -96) {
                child.remove();
                i--;
                l--;
            }
        }
    }
    mousedown(event) {
        let self = event.clickTarget;
        if (event.selfX > self.stopBitmap.x && event.selfX < self.stopBitmap.x + self.stopBitmap.getWidth() && 
   event.selfY > self.stopBitmap.y && event.selfY < self.stopBitmap.y + self.stopBitmap.getHeight()) {
            if (common.stopFlag) {
                self.stopBitmap.bitmapData = self.stopBitmapData;
                common.soundPlayer.background.play();
            } else {
                self.stopBitmap.bitmapData = self.playBitmapData;
                common.soundPlayer.background.stop();
            }
            common.stopFlag = !common.stopFlag;
            return;
        }
        if (common.gameBody.isStop()) return;
        common.soundPlayer.loadSound();
        self.character.jump();
    }
    mouseup(event) {
        let self = event.clickTarget;
        if (common.gameBody.isStop()) return;
        self.character.jumpover();
    }
    gameOver(event) {
        let self = this;
        self.removeEventListener(LMouseEvent.MOUSE_UP, self.mouseup);
        self.removeEventListener(LMouseEvent.MOUSE_DOWN, self.mousedown);
        let overLayer = new GameOver();
        self.addChild(overLayer);
    }
}
export default GameBody;