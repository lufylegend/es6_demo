

import LGlobal from './plugin/lufylegend/utils/LGlobal';
import { LInit } from './plugin/lufylegend/utils/Function';
import LStageScaleMode from './plugin/lufylegend/display/LStageScaleMode';
import LStageAlign from './plugin/lufylegend/display/LStageAlign';
import LLoadManage from './plugin/lufylegend/system/LLoadManage';
import {gameInit} from './scripts/common';
import LAtlas from './plugin/lufylegend/system/LAtlas';

LGlobal.width = 640;
LGlobal.height = LGlobal.width * window.innerHeight / window.innerWidth;

//通过LLoadManage读取atlas
let loadData = [
    {name:'Card',type:LAtlas.TYPE_PLIST,path:"./resources/atlas"}
];

LInit(50, 'legend', LGlobal.width, LGlobal.height, main);

function main() {
    LGlobal.align = LStageAlign.TOP_LEFT;
    LGlobal.stageScale = LStageScaleMode.SHOW_ALL;
    LGlobal.screen(LGlobal.FULL_SCREEN);
	LLoadManage.load(
		loadData,
		function(progress){
		},
		function(result){
			LGlobal.setDebug(true);
			gameInit();
		}
	);
}