
import PrefabContainer from '../../plugin/mvc/prefabs/PrefabContainer';
//import EventManager from '../managers/EventManager';
import BindSpriteView from '../../plugin/mvc/views/BindSpriteView';
//import CharacterView from './CharacterView';
//import LPoint from '../../plugin/lufylegend/geom/LPoint';
import LMouseEvent from '../../plugin/lufylegend/events/LMouseEvent';
import LRectangle from '../../plugin/lufylegend/geom/LRectangle';
//import LSprite from '../../plugin/lufylegend/display/LSprite';
//import ConfigManager from '../managers/ConfigManager';
class BattlefieldView extends BindSpriteView {
    init(data) {
        super.init(data);
        //this.addEventListener(LMouseEvent.MOUSE_DOWN, this._touchMe, this);
        //EventManager.addEventListener('card:dragEnd', this._dragEnd, this);
    }
    die() {
        super.die();
        //this.removeEventListener(LMouseEvent.MOUSE_DOWN, this._touchMe);
        //EventManager.removeEventListener('card:dragEnd', this._cardChange);
    }
    _touchMe(event) {
        let controller = this.getController();
        /*let paddle = event.target;
        if (paddle.objectIndex !== this.me.objectIndex) {
            return;
        }*/
        this.paddle = controller.me;
        this.paddle.dragRange = new LRectangle(32, 752, 528, 0);
        this.paddle.startDrag(event.touchPointID);
        this.addEventListener(LMouseEvent.MOUSE_UP, this._touchEnd, this);
    }
    _touchEnd(event) {
        this.removeEventListener(LMouseEvent.MOUSE_UP, this._touchEnd);
        this.paddle.stopDrag();
        this.paddle = null;
        let controller = this.getController();
        if (controller.ball.alpha === 0) {
            controller.me.shoot(controller.me.x + 12, controller.me.y - 24, true);
        }

    }
    updateView() {
        super.updateView();
        /*
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
        */
        //MasterClient.
        /*
        for (let child of mainCharacters) {
            let character = new CharacterView({ id: child.id, level: 1, playerId: 1 });
            character.setCoordinate(child.x * 32, child.y * 24);
            this.characterLayer.addChild(character);
            
            let enemy = new CharacterView({ id: child.id, level: 1, playerId: 1 });
            enemy.setCoordinate((18 - child.x - character.model.width) * 32, (32 - child.y - character.model.height) * 24);
            this.characterLayer.addChild(enemy);
        }*/
    }
    /*
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
    }*/
}
PrefabContainer.set('BattlefieldView', BattlefieldView);
export default BattlefieldView;