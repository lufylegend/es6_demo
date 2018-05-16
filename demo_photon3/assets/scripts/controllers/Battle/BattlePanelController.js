import PrefabContainer from '../../../plugin/mvc/prefabs/PrefabContainer';
import PanelController from '../../../plugin/mvc/controllers/PanelController';
//import BaseManager from '../../../plugin/mvc/managers/BaseManager';
//import masterClient from '../../utils/MasterClient';
import LGlobal from '../../../plugin/lufylegend/utils/LGlobal';
import EventManager from '../../managers/EventManager';
import LMouseEvent from '../../../plugin/lufylegend/events/LMouseEvent';
import LRectangle from '../../../plugin/lufylegend/geom/LRectangle';

class BattlePanelController extends PanelController {
    onLoad(request) {
        super.onLoad(request);
        this.dispatcher.skills = [
            { id: 1, name: '测试1', icon: 'skill01', cost: 3 }, 
            { id: 2, name: '测试2', icon: 'skill02', cost: 5 }, 
            { id: 3, name: '测试3', icon: 'skill03', cost: 2 }, 
            { id: 4, name: '测试4', icon: 'skill04', cost: 3 }
        ];
        console.log('BattlePanelController onLoad');
    }
    onLoadEnd() {
        super.onLoadEnd();
        this._resizeBattleLayer();
        EventManager.addEventListener('enemy:move', this._enemyMove, this);
        EventManager.addEventListener('ball:sendout', this._ballSendOut, this);
        this.me.addEventListener(LMouseEvent.MOUSE_DOWN, this._touchMe, this);

        //this.battleLayer
        //masterClient.battleReady();
    }
    die() {
        EventManager.removeEventListener('enemy:move', this._enemyMove);
        EventManager.removeEventListener('ball:sendout', this._ballSendOut);
    }
    _resizeBattleLayer() {
        if (LGlobal.width / LGlobal.height > this.battleLayer.getWidth() / this.battleLayer.getHeight()) {
            this.battleLayer.scaleX = this.battleLayer.scaleY = LGlobal.height / this.battleLayer.getHeight();
        } else {
            this.battleLayer.scaleX = this.battleLayer.scaleY = LGlobal.width / this.battleLayer.getWidth();
        }
        this.battleLayer.x = (LGlobal.width - this.battleLayer.getWidth()) * 0.5;
        this.battleLayer.y = (LGlobal.height - this.battleLayer.getHeight()) * 0.5;
    }
    _enemyMove(event) {

    }
    _touchMe(event) {
        let paddle = event.target;
        if (paddle.objectIndex !== this.me.objectIndex) {
            return;
        }
        this.paddle = paddle;
        paddle.dragRange = new LRectangle(32, 752, 528, 0);
        paddle.startDrag(event.touchPointID);
        this.addEventListener(LMouseEvent.MOUSE_UP, this._touchEnd, this);
    }
    _touchEnd(event) {
        if (!this.paddle) {
            return;
        }
        this.removeEventListener(LMouseEvent.MOUSE_UP, this._touchEnd);
        this.paddle.stopDrag();
        this.paddle = null;
        if (this.ball.alpha === 0) {
            EventManager.dispatchEvent('ball:sendout');
        }

    }
    _ballSendOut(event) {
        this.ball.alpha = 1;
        this.ball.x = this.me.x + 12;
        this.ball.y = this.me.y - 24;
        this.ball.vec.x = 1;
        this.ball.vec.y = 1;
    }
}
PrefabContainer.set('BattlePanelController', BattlePanelController);
export default BattlePanelController;