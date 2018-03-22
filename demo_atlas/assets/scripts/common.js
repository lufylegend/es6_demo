import LAtlas from '../plugin/lufylegend/system/LAtlas';
import LSpriteAtlasType from '../plugin/lufylegend/system/LSpriteAtlasType';
import {addChild} from '../plugin/lufylegend/utils/Function';
import LTextField from '../plugin/lufylegend/text/LTextField';
import LEvent from '../plugin/lufylegend/events/LEvent';

export function gameInit(){
    let textField = new LTextField();
    textField.text = 'lufylegend atlas demo';
    textField.x = 100;
    textField.y = 10;
    addChild(textField);
    //通过LAtlas读取atlas
    let atlas = new LAtlas();
    atlas.addEventListener(LEvent.COMPLETE, ()=>{
        atlasLoadComplete();
    });
    atlas.load("./resources/atlas", 'common');
}
function atlasLoadComplete(){
    let atlasCommon = LAtlas.get('atlas/common');
    let frame_001 = atlasCommon.getSprite('frame_001', LSpriteAtlasType.SLICED, 150, 150);
    frame_001.x = 100;
    frame_001.y = 100;
    addChild(frame_001);

    let atlasCard = LAtlas.get('atlas/Card');
    let dragon = atlasCard.getSprite('dragon', LSpriteAtlasType.SIMPLE, 100, 100);
    dragon.x = 25;
    dragon.y = 25;
    frame_001.addChild(dragon);
}