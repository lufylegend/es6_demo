
import PrefabContainer from '../../plugin/mvc/prefabs/PrefabContainer';
import EventManager from '../managers/EventManager';
import BindSpriteView from '../../plugin/mvc/views/BindSpriteView';
import CharacterView from './CharacterView';
//import MasterClient from '../utils/MasterClient';
import LPoint from '../../plugin/lufylegend/geom/LPoint';
import LSprite from '../../plugin/lufylegend/display/LSprite';
class BattlefieldView extends BindSpriteView {
    init(data) {
        super.init(data);
        EventManager.addEventListener('card:dragEnd', this._dragEnd, this);
    }
    die() {
        super.die();
        EventManager.removeEventListener('card:dragEnd', this._cardChange);
    }
    updateView() {
        super.updateView();
        let sprite = new LSprite();
        sprite.graphics.add(function(ctx) {
            ctx.beginPath();
            ctx.strokeStyle = '#FF0000';
            ctx.lineWidth = 1;
            for (let i = 0;i < 18;i++) {
                ctx.moveTo(i * 32, 0);
                ctx.lineTo(i * 32, 768);
            }
            for (let i = 0;i < 32;i++) {
                ctx.moveTo(0, i * 24);
                ctx.lineTo(576, i * 24);
            }
            ctx.stroke();
        });
        this.addChild(sprite);
        this.characterLayer = new LSprite();
        this.addChild(this.characterLayer);

        let character = new CharacterView({ id: 1, level: 1, playerId: 1 });
        character.setCoordinate(8 * 32, 28 * 24);
        this.characterLayer.addChild(character);

        character = new CharacterView({ id: 2, level: 1, playerId: 1 });
        character.setCoordinate(3 * 32, 25 * 24);
        this.characterLayer.addChild(character);
    }
    _dragEnd(event) {
        let hit = this.hitTestPoint(event.x, event.y);
        if (hit) {
            let card = event.card;
            let point = this.getChildAt(0).globalToLocal(new LPoint(event.x, event.y));
            console.log('point=', point, (point.x / 32 >>> 0), (point.y / 24 >>> 0));
            //let character = new CharacterView({ id: card.model.id, level: 1, playerId: MasterClient.playerId });
            let character = new CharacterView({ id: card.model.id, level: 1, playerId: 1 });
            character.setCoordinate((point.x / 32 >>> 0) * 32, (point.y / 24 >>> 0) * 24);
            this.characterLayer.addChild(character);
            EventManager.dispatchEvent('card:change');
        } else {
            EventManager.dispatchEvent('card:back');
        }
    }
}
PrefabContainer.set('BattlefieldView', BattlefieldView);
export default BattlefieldView;