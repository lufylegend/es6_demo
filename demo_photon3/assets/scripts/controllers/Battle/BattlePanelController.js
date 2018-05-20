import PrefabContainer from '../../../plugin/mvc/prefabs/PrefabContainer';
import PanelController from '../../../plugin/mvc/controllers/PanelController';
//import BaseManager from '../../../plugin/mvc/managers/BaseManager';
//import masterClient from '../../utils/MasterClient';
import LGlobal from '../../../plugin/lufylegend/utils/LGlobal';
//import EventManager from '../../managers/EventManager';
import LMouseEvent from '../../../plugin/lufylegend/events/LMouseEvent';
import LRectangle from '../../../plugin/lufylegend/geom/LRectangle';
import masterClient, { GameEvent } from '../../utils/MasterClient';
import LAtlas from '../../../plugin/lufylegend/system/LAtlas';
import LSpriteAtlasType from '../../../plugin/lufylegend/system/LSpriteAtlasType';
import LTweenLite from '../../../plugin/lufylegend/transitions/LTweenLite';
import LTimer from '../../../plugin/lufylegend/utils/LTimer';
import LTimerEvent from '../../../plugin/lufylegend/events/LTimerEvent';

class BattlePanelController extends PanelController {
    onLoad(request) {
        super.onLoad(request);
        this.dispatcher.icons = [
            { id: 1, name: '测试1', icon: '001' }, 
            { id: 2, name: '测试2', icon: '002' }, 
            { id: 3, name: '测试3', icon: '003' }, 
            { id: 4, name: '测试4', icon: '004' }, 
            { id: 5, name: '测试5', icon: '005' }
        ];
        console.log('BattlePanelController onLoad');
    }
    onLoadEnd() {
        super.onLoadEnd();
        this._resizeBattleLayer();
        this.canShoot = false;
        masterClient.addEventListener('enemy:move', this._enemyMove, this);
        this.addEventListener(LMouseEvent.MOUSE_DOWN, this._touchMe, this);
        masterClient.addEventListener(GameEvent.BOUT_WIN, this._boutWin, this);
        masterClient.addEventListener(GameEvent.BOUT_FAIL, this._boutFail, this);
        masterClient.addEventListener(GameEvent.SEND_ICON, this._sendIcon, this);
        this.timer = new LTimer(200, 0);
        this.timer.addEventListener(LTimerEvent.TIMER, this._timerHandler, this);
        this.timer.start();
        if (masterClient.isLeader) {
            setTimeout(() => {
                masterClient.dispatchEvent(GameEvent.BOUT_FAIL);
            }, 100);
        }
    }
    die() {
        masterClient.removeEventListener('enemy:move', this._enemyMove);
        masterClient.removeEventListener(GameEvent.BOUT_WIN, this._boutWin);
        masterClient.removeEventListener(GameEvent.BOUT_FAIL, this._boutFail);
        masterClient.removeEventListener(GameEvent.SEND_ICON, this._sendIcon);
        this.removeEventListener(LMouseEvent.MOUSE_DOWN, this._touchMe);
        this.timer.removeEventListener(LTimerEvent.TIMER, this._timerHandler);
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
    _boutWin(event) {
        this.ball.alpha = 0;
        this.boutLayer.visible = true;
        this.boutTxt.text = '对方发球';
        this.canShoot = false;
    }
    _boutFail(event) {
        this.ball.alpha = 0;
        this.boutLayer.visible = true;
        this.boutTxt.text = '我方发球';
        this.canShoot = true;
    }
    _sendIcon(event) {
        let atlasCommon = LAtlas.get('atlas/Icon');
        let icon = atlasCommon.getSprite(event.icon, LSpriteAtlasType.SIMPLE, 100, 100);
        icon.x = this.deskLayer.x + 100;
        if (event.id === masterClient.playerId) {
            icon.y = this.deskLayer.y + this.deskLayer.getHeight() - 150;
        } else {
            icon.y = this.deskLayer.y + 100;
        }
        this.battleLayer.addChild(icon);
        LTweenLite.to(icon, 0.3, { delay: 0.5, alpha: 0, onComplete: (event) => {
            event.target.remove();
        } });
    }
    _timerHandler(event) {
        masterClient.enemyMove(this.me.x);
    }
    _enemyMove(event) {
        if (this.tween) {
            LTweenLite.remove(this.tween);
        }
        this.tween = LTweenLite.to(this.enemy, 0.1, { x: this.deskLayer.x + this.deskLayer.getWidth() - this.enemy.getWidth() - event.x, onComplete: (event) => {
            this.tween = null;
        } });
    }
    _touchMe(event) {
        if (this.paddle) {
            return;
        }
        this.paddle = this.me;
        this.paddle.dragRange = new LRectangle(32, 752, 528, 0);
        this.paddle.startDrag(event.touchPointID);
        this.addEventListener(LMouseEvent.MOUSE_UP, this._touchEnd, this);
    }
    _touchEnd(event) {
        if (!this.paddle) {
            return;
        }
        this.removeEventListener(LMouseEvent.MOUSE_UP, this._touchEnd);
        this.paddle.stopDrag();
        this.paddle = null;
        if (this.canShoot) {
            this.me.shoot(this.me.x + 12, this.me.y - 24, true);
        }

    }
}
PrefabContainer.set('BattlePanelController', BattlePanelController);
export default BattlePanelController;