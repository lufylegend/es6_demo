

import LGlobal from './plugin/lufylegend/utils/LGlobal';
import { LInit } from './plugin/lufylegend/utils/Function';
import LStageScaleMode from './plugin/lufylegend/display/LStageScaleMode';
import LStageAlign from './plugin/lufylegend/display/LStageAlign';
//import LLoadManage from './plugin/lufylegend/system/LLoadManage';
//import { Common } from './scripts/utils/Common';
import BaseManager from './plugin/mvc/managers/BaseManager';
LGlobal.width = 640;
if (LGlobal.mobile) {
    LGlobal.height = LGlobal.width * window.innerHeight / window.innerWidth;
} else {
    LGlobal.height = 960;
}
/*let loadData = [
];*/

LInit(null, 'legend', LGlobal.width, LGlobal.height, main);

function main() {
    LGlobal.align = LStageAlign.TOP_LEFT;
    LGlobal.stageScale = LStageScaleMode.SHOW_ALL;
    if (LGlobal.mobile) {
        LGlobal.screen(LGlobal.FULL_SCREEN);
    }

    LGlobal.setDebug(true);
    BaseManager.loadScene('prefabs/scene/Top');
    /*
    LLoadManage.load(
        loadData,
        function(progress) {
        },
        (result) => {
            Common.datalist = result;
            BaseManager.loadScene('prefabs/Scene/Top');
        }
    );*/
}