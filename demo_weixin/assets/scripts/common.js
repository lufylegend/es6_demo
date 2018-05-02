
import { addChild } from '../plugin/lufylegend/utils/Function';
import Logo from './Logo';
import LSprite from '../plugin/lufylegend/display/LSprite';
import LTweenLite from '../plugin/lufylegend/transitions/LTweenLite';
import GameBody from './GameBody';
import SoundPlayer from './SoundPlayer';
export let common = {
    gameBody: null,
    datalist: {},
    g: 3,
    MOVE_STEP: 8,
    MOVE_STEP_SLOW: 8,
    MOVE_STEP_FAST: 12,
    stopFlag: false,
    soundPlayer: null
};
let stageLayer;
export function gameInit() {

    stageLayer = new LSprite();
    addChild(stageLayer);
    common.soundPlayer = new SoundPlayer();
    let logo = new Logo();
    stageLayer.addChild(logo);
}
export function gameStart() {
    if (common.gameBody) {
        common.soundPlayer.playSound('background');
    }
    stageLayer.die();
    stageLayer.removeAllChild();
    LTweenLite.removeAll();
    common.MOVE_STEP = common.MOVE_STEP_SLOW;
    common.gameBody = new GameBody();
    stageLayer.addChild(common.gameBody);
}