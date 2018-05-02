import LSound from '../plugin/lufylegend/media/LSound';
import LGlobal from '../plugin/lufylegend/utils/LGlobal';
import { common } from './common';
import LEvent from '../plugin/lufylegend/events/LEvent';
import { OS_PC } from '../plugin/lufylegend/utils/LConstant';

/**
 * @author lufy
 */
class SoundPlayer {
    constructor() {
        let self = this;
        self.loadIndex = 0;
        self.background = new LSound();
        self.background.parent = self;
        //如果没有预先读取的音频
        if (!common.datalist['sound_background']) {
            return;
        }
        self.background.addEventListener(LEvent.COMPLETE, self.backgroundLoadComplete);
        self.background.load(common.datalist['sound_background']);
        //如果是移动浏览器，并且不支持WebAudio，则无法适用多声道，所以只适用背景音乐
        if (LGlobal.mobile && !LSound.webAudioEnabled && !LGlobal.wx) {
            return;
        }
        self.get = new LSound();
        self.get.parent = self;
        self.fly = new LSound();
        self.fly.parent = self;
        self.jump = new LSound();
        self.jump.parent = self;
        self.gameover = new LSound();
        self.gameover.parent = self;
        self.jump.addEventListener(LEvent.COMPLETE, self.jumpLoadComplete);
        self.jump.load(common.datalist['sound_jump']);
        self.get.addEventListener(LEvent.COMPLETE, self.getLoadComplete);
        self.get.load(common.datalist['sound_get']);
        self.fly.addEventListener(LEvent.COMPLETE, self.flyLoadComplete);
        self.fly.load(common.datalist['sound_fly']);
        self.gameover.addEventListener(LEvent.COMPLETE, self.gameoverLoadComplete);
        self.gameover.load(common.datalist['sound_gameover']);
    }
    loadSound() {
        let self = this;
        //如果PC环境，或者支持WebAudio，则已经预先读取了音频，无需再次读取
        if (LSound.webAudioEnabled || LGlobal.os === OS_PC) {
            if (LGlobal.mobile) {
                switch (self.loadIndex++) {
                case 0:
                    self.get.play(self.get.length);
                    break;
                case 1:
                    self.fly.play(self.fly.length);
                    break;
                case 2:
                    self.gameover.play(self.gameover.length);
                    break;
                }
            }
            return;
        }
        //已读取音频，无需再次读取
        if (self.loadIndex > 0) {
            return;
        }
        self.loadIndex++;
        self.background.addEventListener(LEvent.COMPLETE, self.backgroundLoadComplete);
        self.background.load('./sound/background.mp3');
    }
    playSound(name) {
        let self = this;
        switch (name) {
        case 'get':
            if (!self.getIsLoad) return;
            self.get.play(0, 1);
            break;
        case 'fly':
            if (!self.flyIsLoad || self.fly.playing) return;
            self.fly.play(0, 1);
            break;
        case 'jump':
            if (!self.jumpIsLoad) return;
            self.jump.play(0, 1);
            break;
        case 'gameover':
            if (!self.gameoverIsLoad) return;
            self.gameover.play(0, 1);
            break;
        case 'background':
            if (!self.backgroundIsLoad) return;
            self.background.close();
            self.background.play(0, 100);
            break;
        }
    }
    backgroundLoadComplete(event) {
        let self = event.currentTarget;
        self.parent.backgroundIsLoad = true;
        self.play(0, 100);

    }
    getLoadComplete(event) {
        let self = event.currentTarget;
        self.parent.getIsLoad = true;
    }
    flyLoadComplete(event) {
        let self = event.currentTarget;
        self.parent.flyIsLoad = true;
    }
    jumpLoadComplete(event) {
        let self = event.currentTarget;
        self.parent.jumpIsLoad = true;
    }
    gameoverLoadComplete(event) {
        let self = event.currentTarget;
        self.parent.gameoverIsLoad = true;
    }
}
export default SoundPlayer;