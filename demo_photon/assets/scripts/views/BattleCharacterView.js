
import BindListChildView from '../../plugin/mvc/views/BindListChildView';
import PrefabContainer from '../../plugin/mvc/prefabs/PrefabContainer';
import LTweenLite from '../../plugin/lufylegend/transitions/LTweenLite';
import EventManager from '../managers/EventManager';
import LEvent from '../../plugin/lufylegend/events/LEvent';
import MasterClient from '../utils/MasterClient';
class BattleCharacterView extends BindListChildView {
    changeSkill() {
        this.skill = this.model.skills[this.model.skills.length * Math.random() >>> 0];
    }
    //attack(enemy) {
    attack(index) {
        console.log('attack index=' + index);
        let attackSkill = this.skill;
        let event = new LEvent('player:attack');
        event.index = index;
        event.hert = attackSkill.value;
        EventManager.dispatchEvent(event);
        MasterClient.attack(index, attackSkill.value);
        /*
        LTweenLite.to(this, 0.1, { y: -15, onComplete: function() {
            enemy.hert(attackSkill.value);
        } }).to(this, 0.1, { y: 0, delay: 0.1, onComplete: function() {} });*/
    }
    attackPlayer(hert) {
        LTweenLite.to(this, 0.1, { y: 15, onComplete: function() {
            let event = new LEvent('player:hert');
            event.hertValue = hert;
            EventManager.dispatchEvent(event);
        } }).to(this, 0.1, { y: 0, delay: 0.1, onComplete: function() {} });
    }
    attackEnemy(hert) {
        LTweenLite.to(this, 0.1, { y: -15, onComplete: function() {
            let event = new LEvent('enemy:hert');
            event.hertValue = hert;
            EventManager.dispatchEvent(event);
        } }).to(this, 0.1, { y: 0, delay: 0.1, onComplete: function() {} });
    }
}
PrefabContainer.set('BattleCharacterView', BattleCharacterView);
export default BattleCharacterView;