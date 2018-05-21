
import PrefabContainer from '../../plugin/mvc/prefabs/PrefabContainer';
import BindSpriteView from '../../plugin/mvc/views/BindSpriteView';
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
}
PrefabContainer.set('BattlefieldView', BattlefieldView);
export default BattlefieldView;