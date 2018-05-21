import PrefabContainer from '../../../plugin/mvc/prefabs/PrefabContainer';
import BindSpriteView from '../../../plugin/mvc/views/BindSpriteView';
import LEvent from '../../../plugin/lufylegend/events/LEvent';
import LVec2 from '../../../plugin/lufylegend/geom/LVec2';
import EventManager from '../../managers/EventManager';
import masterClient from '../../utils/MasterClient';
import LTweenLite from '../../../plugin/lufylegend/transitions/LTweenLite';
const SPEED_Y = 1;
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
    _move() {
        let controller = this.getController();
        //this.startTime = masterClient.now;
        //this.arrivalTime = params.arrivalTime;
        this.sumLength = this.sumLength || (controller.me.y - controller.enemy.y);
        let nowLength = this.sumLength * (masterClient.now - this.startTime) / (this.arrivalTime - this.startTime);
        this.startTop = this.startTop || (controller.enemy.y + controller.enemy.getHeight());
        this.startBottom = this.startBottom || (controller.me.y - this.size);
        if (this.vec.y > 0) {
            while (this.y < this.startTop + nowLength) {
                this.x += this.vec.x;
                this.y += this.vec.y;
            }
        } else {
            while (this.y > this.startBottom - nowLength) {
                this.x += this.vec.x;
                this.y += this.vec.y;
            }
        }
    }
    _onframe(event) {
        if (this.alpha === 0) {
            return;
        }
        let controller = this.getController();
        let deskLayer = controller.deskLayer;
        this._move();
        //this.x += this.vec.x;
        //this.y += this.vec.y;
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
            masterClient.boutOver();
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

        //let arrivalTime = event.params.arrivalTime;
        /*let time = arrivalTime - masterClient.now - Math.max(masterClient.diffMillisecond, 200);
        let frames = time / (1000 / 60);
        let enemy = this.getController().enemy;
        let speed = (enemy.y + enemy.getHeight() - event.params.y) / frames;
        let scale = Math.abs(speed / event.params.speedY);*/

        let e = new LEvent('ball:sendout');
        e.enemy = true;
        e.params = event.params;
        controller.timeTxt.text = masterClient.diffMillisecond;
        //e.params.arrivalTime -= (Math.max(masterClient.diffMillisecond, 200) + 100);
        e.params.arrivalTime -= 500;
        e.params.x = deskLayer.x + deskLayer.getWidth() - e.params.x - this.size;
        e.params.y = deskLayer.y + (deskLayer.y + deskLayer.getHeight() - e.params.y - this.size);
        e.params.speedX = e.params.speedX * -1;
        e.params.speedY = e.params.speedY * -1;
        if (this.alpha === 0) {
            EventManager.dispatchEvent(e);
        } else {
            this._enemyEvent = e;
        }
    }
    _ballSendOut(event) {
        let controller = this.getController();
        controller.boutLayer.visible = false;
        controller.canShoot = false;
        let params = event.params;
        if (event.enemy && controller.tween) {
            LTweenLite.remove(controller.tween);
            controller.enemy.x = params.paddleX;
        }
        this.alpha = 1;
        this.x = params.x;
        this.y = params.y;

        let scale = Math.abs(SPEED_Y / params.speedY);
        this.vec.x = params.speedX * scale;
        this.vec.y = SPEED_Y * (params.speedY > 0 ? 1 : -1);
        this.startTime = masterClient.now;
        this.arrivalTime = params.arrivalTime;
    }
}
PrefabContainer.set('BallView', BallView);
export default BallView;