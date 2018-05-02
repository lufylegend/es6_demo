import LSprite from '../plugin/lufylegend/display/LSprite';
import LBitmap from '../plugin/lufylegend/display/LBitmap';
import LBitmapData from '../plugin/lufylegend/display/LBitmapData';
import LMouseEvent from '../plugin/lufylegend/events/LMouseEvent';
import LTextField from '../plugin/lufylegend/text/LTextField';
import { common, gameStart } from './common';

class Logo extends LSprite {
    constructor() {
        super();
        this.init();
    }
    init() {
        let self = this, labelText;
        let bitmap = new LBitmap(new LBitmapData(common.datalist['logo']));
        self.addChild(bitmap);
        self.addEventListener(LMouseEvent.MOUSE_UP, self.start, this);
		
        self.socialList = [];
		
        labelText = new LTextField();
        //labelText.font = "Bauhaus 93";
        labelText.weight = 'normal';
        labelText.size = 12;
        labelText.x = 20;
        labelText.y = 420;
        labelText.text = 'By Html5 Game Engine lufylegend.js';
        self.addChild(labelText);
        labelText = new LTextField();
        labelText.color = '#006400';
        //labelText.font = "Bauhaus 93";
        labelText.size = 12;
        labelText.x = 20;
        labelText.y = 445;
        labelText.text = 'http://lufylegend.com/lufylegend';
        self.addChild(labelText);
    }
    start() {
        //MySoundPlayer.loadSound();
        //MySoundPlayer.playSound("background");
        gameStart();
    }
}
export default Logo;