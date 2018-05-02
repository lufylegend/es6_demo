import LSprite from '../plugin/lufylegend/display/LSprite';
import LBitmapData from '../plugin/lufylegend/display/LBitmapData';
import LAnimationTimeline from '../plugin/lufylegend/display/LAnimationTimeline';
import LGlobal from '../plugin/lufylegend/utils/LGlobal';
import { common } from './common';
import LRectangle from '../plugin/lufylegend/geom/LRectangle';
import LEvent from '../plugin/lufylegend/events/LEvent';
import Character from './Character';
import LTweenLite from '../plugin/lufylegend/transitions/LTweenLite';
import Item from './Item';
import LEasing from '../plugin/lufylegend/transitions/LEasing';
/**
 * @author lufy
 */
class Npc extends LSprite {
    constructor(name) {
        super();
        this.init(name);
    }
    init(name) {
        let self = this;
        self.name = name;
        let data = new LBitmapData(common.datalist[name], 0, 0, 96, 96);
        let list = LGlobal.divideCoordinate(384, 96, 1, 4);
        self.hero = new LAnimationTimeline(data, list);
        self.hero.x = -48;
        self.hero.y = -90;
        self.hero.speed = 6;
        self.addChild(self.hero);
        self.vy = 0;
        self.g = 0;
        self.speedx = 0;
        if (self.name === 'gui') {
            self.g = common.g;
            self.hero.y = -96;
            self.rect = new LRectangle(-48, -70, 96, 70);
        } else if (self.name === 'bird') {
            self.hero.y = -64;
            self.speedx = 4;
            self.rect = new LRectangle(-32, -32, 64, 32);
        }
        //self.graphics.drawRect(2,"#ff0000",[self.rect.x,self.rect.y,self.rect.width,self.rect.height],true,"#880088");
        self.addEventListener(LEvent.ENTER_FRAME, self.onframe);
    }

    onframe(event) {
        let self = event.target;
        if (common.gameBody.isStop()) {
            if (self.hero.mode !== 0) {
                self.hero.stop();
            }
            return;
        } else if (self.hero.mode === 0) {
            self.hero.play();
        }
        self.checkHit();
        self.y += self.vy;
        self.vy += self.g;
        self.x -= (common.MOVE_STEP + self.speedx);
	
        if (self.vy <= 0) return;
	
        let checkList = common.gameBody.runMap.childList, child;
        for (let i = 0, l = checkList.length;i < l;i++) {
            child = checkList[i];
            if (child.checkHitTestPoint(self.x, self.y)) {
                self.y = child.y;
                self.vy = 0;
                break;
            }
        }
    }
    checkHit() {
        let self = this;
        if (self.x < -96) return;
        let runCharacter = common.gameBody.character;
        if (runCharacter.rect.action !== Character.HERT) {
            let ix = (self.x + self.rect.x) > (runCharacter.x + runCharacter.rect.x) ? (self.x + self.rect.x) : (runCharacter.x + runCharacter.rect.x);
            let iy = (self.y + self.rect.y) > (runCharacter.y + runCharacter.rect.y) ? (self.y + self.rect.y) : (runCharacter.y + runCharacter.rect.y);
            let ax = (self.x + self.rect.x + self.rect.width) > (runCharacter.x + runCharacter.rect.x + runCharacter.rect.width) ? (runCharacter.x + runCharacter.rect.x + runCharacter.rect.width) : (self.x + self.rect.x + self.rect.width);
            let ay = (self.y + self.rect.y + self.rect.height) > (runCharacter.y + runCharacter.rect.y + runCharacter.rect.height) ? (runCharacter.y + runCharacter.rect.y + runCharacter.rect.height) : (self.y + self.rect.y + self.rect.height);
            if (ix <= ax && iy <= ay) {
                if (runCharacter.invincible()) {
                    self.removeEventListener(LEvent.ENTER_FRAME, self.onframe);
                    LTweenLite.to(self, 4, { y: Math.random() > 0.5 ? -LGlobal.height : LGlobal.height * 2, x: -200
                        , ease: LEasing.Elastic.easeOut });
                } else {
                    runCharacter.hert();
                }
            }
        }
    }
}
Npc.add = function(floor) {
    if (floor.isStart) return;
    let npc;
    let randNum = Math.random();
    if (randNum > 0.8) {
        npc = new Npc('gui');
        npc.y = floor.y - 32;
    } else if (randNum > 0.6) {
        npc = new Npc('bird');
        npc.y = floor.y - npc.getHeight();
    } else {
        Item.add(floor);
    }
    if (npc) {
        npc.x = 48 + floor.x + (floor.getWidth() - 96) * Math.random();
        common.gameBody.npcLayer.addChild(npc);
    }
};
export default Npc;