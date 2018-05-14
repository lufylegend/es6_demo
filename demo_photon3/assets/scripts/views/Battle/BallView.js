
import PrefabContainer from '../../plugin/mvc/prefabs/PrefabContainer';
import BindSpriteView from '../../plugin/mvc/views/BindSpriteView';
import LEvent from '../../../plugin/lufylegend/events/LEvent';
import LVec2 from '../../../plugin/lufylegend/geom/LVec2';
class BallView extends BindSpriteView {
    init(data) {
        super.init(data);
        this.vec = new LVec2(0, 0);
        this.addEventListener(LEvent.ENTER_FRAME, this._onframe, this);
    }
    die() {
        super.die();
        this.removeEventListener(LEvent.ENTER_FRAME, this._onframe);
    }
    _onframe(event) {
        let controller = this.getController();
        let deskLayer = controller.deskLayer;
        this.x += this.vec.x;
        this.y += this.vec.y;
        if (this.x < deskLayer.x) {
            this.x = 0;
            this.vec.x *= -1;
        }
    }
}
PrefabContainer.set('BallView', BallView);
export default BallView;