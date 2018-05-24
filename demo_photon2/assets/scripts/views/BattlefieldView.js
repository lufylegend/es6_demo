
import PrefabContainer from '../../plugin/mvc/prefabs/PrefabContainer';
import EventManager from '../managers/EventManager';
import BindSpriteView from '../../plugin/mvc/views/BindSpriteView';
import CharacterView from './CharacterView';
import MasterClient from '../utils/MasterClient';
import LPoint from '../../plugin/lufylegend/geom/LPoint';
import LSprite from '../../plugin/lufylegend/display/LSprite';
import ConfigManager from '../managers/ConfigManager';
import LEvent from '../../plugin/lufylegend/events/LEvent';
const mainCharacters = [
    {
        id: 1,
        x: 7,
        y: 28
    },
    {
        id: 2,
        x: 2,
        y: 25
    },
    {
        id: 2,
        x: 13,
        y: 25
    }
];
class BattlefieldView extends BindSpriteView {
    init(data) {
        super.init(data);
        EventManager.addEventListener('card:dragEnd', this._dragEnd, this);
        EventManager.addEventListener('character:debut', this._characterDebut, this);
    }
    die() {
        super.die();
        EventManager.removeEventListener('card:dragEnd', this._cardChange);
        EventManager.removeEventListener('character:debut', this._characterDebut);
    }
    updateView() {
        super.updateView();
        let sprite = new LSprite();
        let map = ConfigManager.get('map');
        sprite.graphics.add(function(ctx) {
            ctx.beginPath();
            ctx.strokeStyle = '#FF0000';
            ctx.lineWidth = 1;

            for (let i = 0;i < map.length;i++) {
                let child = map[i];
                for (let j = 0;j < child.length;j++) {
                    if (child[j] === 1) {
                        ctx.moveTo(j * 32 + 16, i * 24 + 12);
                        ctx.arc(j * 32 + 16, i * 24 + 12, 12, 0, 2 * Math.PI);
                    }
                }
            }
            for (let i = 0;i < map[0].length;i++) {
                ctx.moveTo(i * 32, 0);
                ctx.lineTo(i * 32, 768);
            }
            for (let i = 0;i < map.length;i++) {
                ctx.moveTo(0, i * 24);
                ctx.lineTo(576, i * 24);
            }
            ctx.stroke();
        });
        this.addChild(sprite);
        this.characterLayer = new LSprite();
        this.addChild(this.characterLayer);
        console.log('Battlefield update');
        //MasterClient.
        
        for (let child of mainCharacters) {
            let params = { id: child.id, level: 1, playerId: 1, x: child.x, y: child.y };
            let event = new LEvent('character:debut');
            event.params = params;
            EventManager.dispatchEvent(event);
            //let character = new CharacterView({ id: child.id, level: 1, playerId: 1 });
            //character.setCoordinate(child.x * 32, child.y * 24);
            //this.characterLayer.addChild(character);
            
            //let enemy = new CharacterView({ id: child.id, level: 1, playerId: 1 });
            //enemy.setCoordinate((18 - child.x - character.model.width) * 32, (32 - child.y - character.model.height) * 24);
            //this.characterLayer.addChild(enemy);
        }
    }
    _dragEnd(event) {
        let hit = this.hitTestPoint(event.x, event.y);
        if (hit) {
            let card = event.card;
            let point = this.getChildAt(0).globalToLocal(new LPoint(event.x, event.y));
            console.log('point=', point, (point.x / 32 >>> 0), (point.y / 24 >>> 0));

            let params = { id: card.model.id, level: 1, playerId: 1, x: point.x / 32 >>> 0, y: point.y / 24 >>> 0 };
            let e = new LEvent('character:debut');
            e.params = params;
            EventManager.dispatchEvent(e);

            /*let character = new CharacterView({ id: card.model.id, level: 1, playerId: 1 });
            character.setCoordinate((point.x / 32 >>> 0) * 32, (point.y / 24 >>> 0) * 24);
            this.characterLayer.addChild(character);*/
            EventManager.dispatchEvent('card:change');
        } else {
            EventManager.dispatchEvent('card:back');
        }
    }
    _characterDebut(event) {
        let params = event.params;
        let character = new CharacterView({ id: params.id, level: params.level, playerId: params.playerId });
        character.setCoordinate(params.x * 32, params.y * 24);
        this.characterLayer.addChild(character);
    }
}
PrefabContainer.set('BattlefieldView', BattlefieldView);
export default BattlefieldView;