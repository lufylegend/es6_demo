import LSprite from '../plugin/lufylegend/display/LSprite';
import LBitmap from '../plugin/lufylegend/display/LBitmap';
import LBitmapData from '../plugin/lufylegend/display/LBitmapData';
import LAnimationTimeline from '../plugin/lufylegend/display/LAnimationTimeline';
import LGlobal from '../plugin/lufylegend/utils/LGlobal';
import { common } from './common';
import LEvent from '../plugin/lufylegend/events/LEvent';
import LTweenLite from '../plugin/lufylegend/transitions/LTweenLite';
import LEasing from '../plugin/lufylegend/transitions/LEasing';
import LRectangle from '../plugin/lufylegend/geom/LRectangle';

/**
 * @author lufy
 */
class Character extends LSprite {
    constructor(hp) {
        super();
        this.init(hp);
    }
    init(hp) {
        let self = this;
        self.hp = hp;
        let effect = new LBitmap(new LBitmapData(common.datalist['effect']));
        effect.x = -180;
        effect.y = -70;
        self.addChild(effect);
        self.effect = effect;
        self.effect.visible = false;
        let data = new LBitmapData(common.datalist['chara'], 0, 0, 96, 96);
        let list = LGlobal.divideCoordinate(384, 384, 4, 4);
        self.action = Character.RUN;
        self.heroShadows = [new LBitmap(data), new LBitmap(data)];
        self.heroShadows[0].alpha = 0.7;
        self.heroShadows[1].alpha = 0.3;
        self.heroShadows[0].visible = false;
        self.heroShadows[1].visible = false;
        self.addChild(self.heroShadows[0]);
        self.addChild(self.heroShadows[1]);
        self.hero = new LAnimationTimeline(data, list);
        self.hero.setLabel(Character.RUN, 0, 0);
        self.hero.setLabel(Character.FLY, 1, 0);
        self.hero.setLabel(Character.HERT, 2, 0);
        self.hero.setLabel(Character.JUMP, 3, 0);
        self.hero.x = -48;
        self.hero.y = -90;
        self.hero.speed = 6;
        self.addChild(self.hero);
        self.heroShadows[0].x = self.hero.x - 20;
        self.heroShadows[0].y = self.hero.y;
        self.heroShadows[1].x = self.hero.x - 40;
        self.heroShadows[1].y = self.hero.y;
        self.vy = 0;
        self.jumpCount = 0;
        self.distance = 0;
        self.spiritCount = 0;
        self.countValue = common.MOVE_STEP * 5;
		
        self.addEventListener(LEvent.ENTER_FRAME, self.onframe);
    }
    shadowsChange(value) {
        let self = this;
        self.heroShadows[0].visible = value;
        self.heroShadows[1].visible = value;
    }
    spiritEnd() {
        let self = common.gameBody.character;
        self.spiritCount = 0;
        self.hero.play();
        self.hero.onframe();
        self.shadowsChange(true);
    }
    spiritStart() {
        let self = this;
        let runCharacter = common.gameBody.character;
        if (self.spiritCount <= 1) {
            runCharacter.effect.alpha = 0;
            runCharacter.effect.visible = true;
            common.MOVE_STEP = common.MOVE_STEP_FAST;
            LTweenLite.to(runCharacter.effect, 1, { alpha: 1, ease: LEasing.None, onComplete: self.spiritEnd });
            return;
        }
        self.spiritCount--;
        let spirit = new LSprite();
        let spiritBitmap = new LBitmap(new LBitmapData(common.datalist['spiritEffect']));
        spiritBitmap.x = -spiritBitmap.getWidth() * 0.5;
        spiritBitmap.y = -spiritBitmap.getHeight() * 0.5;
        spirit.addChild(spiritBitmap);
        spirit.scaleX = spirit.scaleY = 5;
        self.spirit = spirit;
        self.addChild(spirit);
        LTweenLite.to(spirit, 0.5, { scaleX: 0.1, scaleY: 0.1, rotate: 360, ease: LEasing.None, onComplete: function() {
            self.spirit.remove();
            self.spiritStart();
        } });
    }
    setRect() {
        let self = this;
        self.rect = new LRectangle(32 + self.hero.x, 16 + self.hero.y, 32, 64);
    }
    invincible() {
        return this.effect.visible;
    }
    onframe(event) {
        if (!common.gameBody || !common.gameBody.starCtrl) {
            return;
        }
        let self = event.target;
        if (common.gameBody.isStop()) {
            if (self.hero.mode !== 0) {
                self.hero.stop();
            }
            return;
        } else if (self.hero.mode === 0) {
            self.hero.play();
        }
        self.y += self.vy;
        self.vy += common.g;
        if (self.invincible()) {
            common.gameBody.starCtrl.changeValue(-0.1);
            if (common.gameBody.starCtrl.value <= 0) {
                self.effect.visible = false;
                self.shadowsChange(false);
            }
        }
        if (self.vy > 32)self.vy = 32;
        if (self.y > LGlobal.height + 100) {
            self.die();
            common.soundPlayer.playSound('gameover');
            self.parent.gameOver();
            return;
        }
        self.distance += common.MOVE_STEP;
        let countValue = self.distance / self.countValue >>> 0;
        if (self.distanceObj && self.distanceObj.value < countValue) {
            self.distanceObj.setValue(countValue);
        }
        if (self.action === Character.FLY) {
            self.hp.changeValue(-0.5);
            if (self.hp.value <= 1) {
                self.gotoJump();
            } else {
                common.soundPlayer.playSound('fly');
                self.vy = 0;
                self.y -= 4;
                if (self.y < 64)self.y = 64;
            }
            return;
        } else if (self.action === Character.HERT) {
            if (self.hertCount-- < 0) {
                self.gotoRun();
            }
        } else {
            self.hp.changeValue(0.05);
        }
        if (self.vy < 0) return;
        let checkList = common.gameBody.runMap.childList, child;
        for (let i = 0, l = checkList.length;i < l;i++) {
            child = checkList[i];
            if (child.checkHitTestPoint(self.x, self.y)) {
                self.y = child.y;
                self.vy = 0;
                self.jumpCount = 0;
                self.gotoRun();
                break;
            }
        }
    }
    jump() {
        let self = this;
        if (self.action === Character.HERT) return;
        if (self.jumpCount < 2) {
            common.soundPlayer.playSound('jump');
            self.vy = -30;
            self.jumpCount++;
            self.gotoJump();
        } else if (self.hp.value > 1) {
            self.gotoFly();
        }
    }
    jumpover() {
        let self = this;
        if (self.action === Character.HERT) return;
        self.gotoJump();
    }
    gotoJump() {
        let self = this;
        if (self.action === Character.JUMP) return;
        self.action = Character.JUMP;
        self.hero.gotoAndPlay(Character.JUMP);
    }
    gotoFly() {
        let self = this;
        if (self.action === Character.FLY) return;
        self.action = Character.FLY;
        self.hero.gotoAndPlay(Character.FLY);
        self.hero.onframe();
    }
    gotoRun() {
        let self = this;
        if (self.action === Character.RUN) return;
        if (self.action === Character.HERT && self.hertCount >= 0) return;
		
        self.action = Character.RUN;
        self.hero.gotoAndPlay(Character.RUN);
        self.hero.onframe();
    }
    hert() {
        let self = this;
        if (self.action === Character.HERT) return;
        self.action = Character.HERT;
        self.hero.gotoAndPlay(Character.HERT);
        self.hertCount = 10;
        self.hp.changeValue(-20);
    }
}
Character.RUN = 'run';
Character.FLY = 'fly';
Character.HERT = 'hert';
Character.JUMP = 'jump';

export default Character;