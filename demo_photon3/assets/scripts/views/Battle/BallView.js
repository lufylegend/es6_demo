import PrefabContainer from '../../../plugin/mvc/prefabs/PrefabContainer';
import BindSpriteView from '../../../plugin/mvc/views/BindSpriteView';
import LEvent from '../../../plugin/lufylegend/events/LEvent';
import LVec2 from '../../../plugin/lufylegend/geom/LVec2';
import EventManager from '../../managers/EventManager';
import masterClient from '../../utils/MasterClient';
class BallView extends BindSpriteView {
    init(data) {
        super.init(data);
        this.vec = new LVec2(0, 0);
        this.addEventListener(LEvent.ENTER_FRAME, this._onframe, this);
        EventManager.addEventListener('ball:sendout', this._ballSendOut, this);
        masterClient.addEventListener('ball:sendout', this._ballSendOutToEnemy, this);
    }
    die() {
        super.die();
        this.removeEventListener(LEvent.ENTER_FRAME, this._onframe);
        EventManager.removeEventListener('ball:sendout', this._ballSendOut);
        masterClient.removeEventListener('ball:sendout', this._ballSendOutToEnemy);
    }
    _onframe(event) {
        let controller = this.getController();
        let deskLayer = controller.deskLayer;
        this.x += this.vec.x;
        this.y += this.vec.y;
        if (this.x < deskLayer.x) {
            this.vec.x *= -1;
            this.x = deskLayer.x + deskLayer.x - this.x;
            console.log('min', this.x);
        } else if (this.x > deskLayer.x + 576) {
            this.vec.x *= -1;
            this.x = deskLayer.x + 576 - (this.x - deskLayer.x - 576);
            console.log('max', this.x);
        }
        if (controller.me.checkHitBall()) {
            return;
        }
    }
    _ballSendOutToEnemy(event) {
        let controller = this.getController();
        this.launcher = controller.enemy;
        let deskLayer = controller.deskLayer;
        event.speedY *= -1;
        event.y = deskLayer.y + (deskLayer.y + deskLayer.getHeight() - event.y);
        console.error('_ballSendOutToEnemy', deskLayer.y, deskLayer.getHeight(), event.y);
        this._ballSendOut(event);
    }
    _ballSendOut(event) {
        this.alpha = 1;
        this.x = event.x;
        this.y = event.y;
        this.vec.x = event.speedX;
        this.vec.y = event.speedY;
        console.error(event.x, event.y, event.speedX, event.speedY);
    }
}
PrefabContainer.set('BallView', BallView);
export default BallView;