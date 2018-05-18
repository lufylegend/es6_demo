import PrefabContainer from '../../../plugin/mvc/prefabs/PrefabContainer';
import BindSpriteView from '../../../plugin/mvc/views/BindSpriteView';
import LEvent from '../../../plugin/lufylegend/events/LEvent';
import LVec2 from '../../../plugin/lufylegend/geom/LVec2';
import EventManager from '../../managers/EventManager';
import masterClient from '../../utils/MasterClient';
class BallView extends BindSpriteView {
    init(data) {
        super.init(data);
        this._enemyEvent = null;
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
    get size() {
        this._size = this._size || this.getWidth();
        return this._size;
    }
    get radius() {
        this._radius = this._radius || this.size * 0.5;
        return this._radius;
    }
    _onframe(event) {
        let controller = this.getController();
        let deskLayer = controller.deskLayer;
        this.x += this.vec.x;
        this.y += this.vec.y;
        if (this.x + this.radius < deskLayer.x) {
            this.vec.x *= -1;
            this.x = deskLayer.x + deskLayer.x - (this.x + this.radius) - this.radius;
        } else if (this.x + this.radius > deskLayer.x + 576) {
            this.vec.x *= -1;
            this.x = deskLayer.x + 576 - ((this.x + this.radius) - deskLayer.x - 576) - this.radius;
        }
        if (controller.me.checkHitBall()) {
            return;
        }
        if (this.y > deskLayer.y + deskLayer.getHeight()) {
            this.alpha = 0;
            console.log('you fail');
            return;
        }
        if (!this._enemyEvent) {
            return;
        }
        if (this.y > controller.enemy.y + controller.enemy.getHeight()) {
            return;
        }
        EventManager.dispatchEvent(this._enemyEvent);
        this._enemyEvent = null;
    }
    _ballSendOutToEnemy(event) {
        let controller = this.getController();
        this.launcher = controller.enemy;
        let deskLayer = controller.deskLayer;

        let arrivalTime = event.params.arrivalTime;
        let time = arrivalTime - Date.now() - 1000 * 0.2;
        let frames = time / (1000 / 60);
        let enemy = this.getController().enemy;
        let speed = (enemy.y + enemy.getHeight() - event.params.y) / frames;
        let scale = Math.abs(speed / event.params.speedY);

        let e = new LEvent('ball:sendout');
        e.params = event.params;
        e.params.x = deskLayer.x + deskLayer.getWidth() - e.params.x - this.size;
        e.params.y = deskLayer.y + (deskLayer.y + deskLayer.getHeight() - e.params.y - this.size);
        e.params.speedX = e.params.speedX * -scale;
        e.params.speedY = e.params.speedY * -scale;
        if (this.alpha === 0) {
            EventManager.dispatchEvent(e);
        } else {
            this._enemyEvent = e;
        }
        //EventManager.dispatchEvent(e);
    }
    _ballSendOut(event) {
        let params = event.params;
        this.alpha = 1;
        this.x = params.x;
        this.y = params.y;
        this.vec.x = params.speedX;
        this.vec.y = params.speedY;
    }
}
PrefabContainer.set('BallView', BallView);
export default BallView;