
import LGlobal from './plugin/lufylegend/utils/LGlobal';
import { LInit } from './plugin/lufylegend/utils/Function';
import LoadingSample5 from './plugin/lufylegend/lib/LoadingSample5';
import LStageScaleMode from './plugin/lufylegend/display/LStageScaleMode';
import LStageAlign from './plugin/lufylegend/display/LStageAlign';
import BaseManager from './plugin/mvc/managers/BaseManager';
import FBIManager from './scripts/managers/FBIManager';
import MasterClient from './scripts/utils/MasterClient';

LGlobal.width = 640;
LGlobal.height = LGlobal.width * window.innerHeight / window.innerWidth;
if (!LGlobal.mobile) {
    LGlobal.height = 960;
}
LInit(window.requestAnimationFrame ||
window.webkitRequestAnimationFrame ||
window.mozRequestAnimationFrame ||
window.oRequestAnimationFrame ||
window.msRequestAnimationFrame ||
function(callback, element) {
    window.setTimeout(callback, 1000 / 60);
}, 'legend', LGlobal.width, LGlobal.height, main);

function main() {
    LGlobal.align = LStageAlign.TOP_LEFT;
    LGlobal.stageScale = LStageScaleMode.SHOW_ALL;
    if (LGlobal.mobile) {
        LGlobal.screen(LGlobal.FULL_SCREEN);
    }
    let loading = new LoadingSample5();
    LGlobal.stage.addChild(loading);
    let rand = Math.random();
    let characters = [
        { id: 1, name: '狮子', icon: 'chara-2', skills: [
            { num: 2, value: 1 },
            { num: 3, value: 3 },
            { num: 4, value: 5 },
            { num: 5, value: 8 }
        ] }, 
        { id: 2, name: '狮子', icon: 'chara-3', skills: [
            { num: 2, value: 1 },
            { num: 3, value: 3 },
            { num: 4, value: 5 },
            { num: 5, value: 8 }
        ] }, 
        { id: 3, name: '老虎', icon: 'chara-1', skills: [
            { num: 2, value: 1 },
            { num: 3, value: 3 },
            { num: 4, value: 5 },
            { num: 5, value: 8 }
        ] }, 
        { id: 4, name: '狮子', icon: 'chara-4', skills: [
            { num: 2, value: 1 },
            { num: 3, value: 3 },
            { num: 4, value: 5 },
            { num: 5, value: 8 }
        ] }
    ];
    characters = characters.sort((a, b) => {
        return Math.random() > 0.5 ? 1 : -1;
    });
    MasterClient.addEventListener('game:start', (event) => {
        loading.remove();
        let request = { enemyPlayer: event.enemyPlayer, characters: characters };
        BaseManager.loadScene('prefabs/scene/Battle', request);
    });
    MasterClient.photonClient.start('id-' + rand, 'name-' + rand, { characters: characters });
    window.FBInstant.setLoadingProgress(0);
    FBIManager.initializeAsync()
        .then(() => {
            window.FBInstant.setLoadingProgress(1);
            return FBIManager.start();
        })
        .then(() => {
        });
}