

import LGlobal from './plugin/lufylegend/utils/LGlobal';
import { LInit } from './plugin/lufylegend/utils/Function';
import LStageScaleMode from './plugin/lufylegend/display/LStageScaleMode';
import LStageAlign from './plugin/lufylegend/display/LStageAlign';
import LLoadManage from './plugin/lufylegend/system/LLoadManage';
import { common, gameInit } from './scripts/common';

LGlobal.width = 800;
LGlobal.height = 480;
//LGlobal.height = LGlobal.width * window.innerHeight / window.innerWidth;


let loadData = [
    { name: 'num_0', path: './resources/images/num_0.png' }, 
    { name: 'num_1', path: './resources/images/num_1.png' }, 
    { name: 'num_2', path: './resources/images/num_2.png' }, 
    { name: 'num_3', path: './resources/images/num_3.png' }, 
    { name: 'num_4', path: './resources/images/num_4.png' }, 
    { name: 'num_5', path: './resources/images/num_5.png' }, 
    { name: 'num_6', path: './resources/images/num_6.png' }, 
    { name: 'num_7', path: './resources/images/num_7.png' }, 
    { name: 'num_8', path: './resources/images/num_8.png' }, 
    { name: 'num_9', path: './resources/images/num_9.png' }, 
    { name: 'effect', path: './resources/images/effect.png' }, 
    { name: 'logo', path: './resources/images/logo.png' }, 
    { name: 'inputbox', path: './resources/images/inputbox.png' }, 
    { name: 'spiritEffect', path: './resources/images/spiritEffect.png' }, 
    { name: 'b_background', path: './resources/images/b_background.png' }, 
    { name: 'm_background', path: './resources/images/m_background.png' }, 
    { name: 'stage', path: './resources/images/stage.png' }, 
    { name: 'chara', path: './resources/images/chara.png' }, 
    { name: 'bird', path: './resources/images/bird.png' }, 
    { name: 'gui', path: './resources/images/gui.png' }, 
    { name: 'window', path: './resources/images/window.png' }, 
    { name: 'HP_bg', path: './resources/images/hp_bg.png' },  
    { name: 'HP_value', path: './resources/images/hp_value.png' },
    { name: 'ico_sina', path: './resources/images/ico_sina.gif' },
    { name: 'ico_qq', path: './resources/images/ico_qq.gif' },
    { name: 'ico_facebook', path: './resources/images/ico_facebook.png' },
    { name: 'ico_twitter', path: './resources/images/ico_twitter.png' },
    { name: 'sound_background', path: './resources/sound/background.mp3' },
    { name: 'sound_fly', path: './resources/sound/fly.mp3' },
    { name: 'sound_gameover', path: './resources/sound/gameover.mp3' },
    { name: 'sound_get', path: './resources/sound/get.mp3' },
    { name: 'sound_jump', path: './resources/sound/jump.mp3' }
];

LInit(window.requestAnimationFrame ||
 window.webkitRequestAnimationFrame ||
 window.mozRequestAnimationFrame ||
 window.oRequestAnimationFrame ||
 window.msRequestAnimationFrame ||
 function(callback, element) {
     window.setTimeout(callback, 1000 / 60);
 }, 'legend', LGlobal.width, LGlobal.height, main);

function main() {
    LGlobal.setDebug(true);
    LGlobal.align = LStageAlign.TOP;
    LGlobal.stageScale = LStageScaleMode.SHOW_ALL;
    LGlobal.screen(LGlobal.FULL_SCREEN);
    LLoadManage.load(
        loadData,
        function(progress) {
        },
        function(result) {
            common.datalist = result;
            gameInit();
        }
    );
}