
import BindListChildView from '../../plugin/mvc/views/BindListChildView';
import PrefabContainer from '../../plugin/mvc/prefabs/PrefabContainer';
import LTextField from '../../plugin/lufylegend/text/LTextField';
import LTweenLite from '../../plugin/lufylegend/transitions/LTweenLite';
//import LTimer from '../../plugin/lufylegend/utils/LTimer';
//import LTimerEvent from '../../plugin/lufylegend/events/LTimerEvent';
import EventManager from '../managers/EventManager';
import LEvent from '../../plugin/lufylegend/events/LEvent';
import LAtlas from '../../plugin/lufylegend/system/LAtlas';
class EnemyCharacterView extends BindListChildView {
    updateView() {
        super.updateView();
        let value = this.getByPath(this.bind.key);
        if (value === null) {
            return;
        }
        this.updateWidget(value);
        this.hp = this.model.hp;
        this.hpBar = this.getChildByName('HpBar');
        /*
        this.timer = new LTimer(10000);
        this.timer.addEventListener(LTimerEvent.TIMER, () => {
            this.attack();
        });
        this.timer.start();*/
    }
    attack() {
        let atlas = LAtlas.get('atlas/ui');
        let glass = atlas.getSprite('glass');
        glass.scaleX = glass.scaleY = 2;
        this.parent.addChild(glass);
        LTweenLite.to(this.parent, 0.05, { x: -5, y: -5 })
            .to(this.parent, 0.1, { x: 5, y: 5 })
            .to(this.parent, 0.05, { x: 0, y: 0 })
            .to(glass, 0.1, { aplha: 0, onComplete: () => {
                glass.remove();
            } });
        let event = new LEvent('player:hert');
        event.hertValue = 10;
        EventManager.dispatchEvent(event);
    }
    hert(value) {
        let minusText = new LTextField();
        minusText.x = 100;
        minusText.y = 20;
        minusText.size = 30;
        minusText.color = '#FFFFFF';
        minusText.text = `-${value}`;
        this.hp -= value;
        if (this.hp > 0) {
            this.hpBar.resize((this.hp * 300 / this.model.hp) >> 0, 24);
        } else {
            this.hpBar.visible = false;
        }
        
        this.addChild(minusText);
        LTweenLite.to(minusText, 0.2, { y: 10 }).to(minusText, 0.1, { y: 0, onComplete: function(event) {
            event.target.remove();
        } });
    }
}
PrefabContainer.set('EnemyCharacterView', EnemyCharacterView);
export default EnemyCharacterView;