import PrefabContainer from '../../../plugin/mvc/prefabs/PrefabContainer';
import BindSpriteView from '../../../plugin/mvc/views/BindSpriteView';
import LEvent from '../../../plugin/lufylegend/events/LEvent';
import EventManager from '../../managers/EventManager';
import masterClient from '../../utils/MasterClient';
//import LVec2 from '../../../plugin/lufylegend/geom/LVec2';
class PaddleView extends BindSpriteView {
    init(data) {
        super.init(data);
    }
    die() {
        super.die();
    }
    get ball() {
        this._ball = this._ball || this.getController().ball;
        return this._ball;
    }
    checkHitBall() {
        if (this.ball.alpha === 0 || this.ball.launcher.objectIndex === this.objectIndex) {
            return false;
        }
        if (this.ball.y + this.ball.getHeight() < this.y) {
            return false;
        }
        if (!this.hitTestObject(this.ball)) {
            return false;
        }
        if (this.ball.y + this.ball.getHeight() > this.y + this.getHeight() * 0.5) {
            return false;
        }
        this.shoot(this.ball.x, this.ball.y);
    }
    shoot(x, y, isStart) {
        this.ball.launcher = this;
        let event = new LEvent('ball:sendout');
        event.x = x;
        event.y = y;
        let speed = 8;
        if (isStart) {
            let rand = Math.random();
            let angle = (45 + 90 * rand) * Math.PI / 180;
            event.speedX = speed * Math.sin(angle) * (rand > 0.5 ? -1 : 1);
            event.speedY = speed * Math.abs(Math.cos(angle)) * -1;
        } else {
            speed += this.ball.vec.length() * 0.5 * Math.random();
            this.ball.vec.x = this.ball.x + this.ball.getWidth() * 0.5 - this.x - this.getWidth() * 0.5;
            this.ball.vec.y = this.ball.y + this.ball.getHeight() * 0.5 - this.y - this.getHeight() * 0.5;
            let vec = this.ball.vec.normalize();
            vec.x *= speed;
            vec.y *= speed;
            event.speedX = vec.x;
            event.speedY = vec.y;
        }
        EventManager.dispatchEvent(event);
        masterClient.shoot(event);
    }
}
PrefabContainer.set('PaddleView', PaddleView);
export default PaddleView;