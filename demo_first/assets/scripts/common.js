import Bird from './Bird';
import {addChild} from '../plugin/lufylegend/utils/Function';
import LTextField from '../plugin/lufylegend/text/LTextField';
export let common = {
    datalist:{}
};

export function gameInit(){
    let textField = new LTextField();
    textField.text = 'es6 demo';
    textField.x = 100;
    textField.y = 10;
    addChild(textField);
    
    let bird = new Bird(common.datalist['bird']);
    bird.x = 100;
    bird.y = 100;
    addChild(bird);
}