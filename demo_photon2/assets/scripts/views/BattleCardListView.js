
import BaseBindView from '../../plugin/mvc/views/BaseBindView';
import PrefabContainer from '../../plugin/mvc/prefabs/PrefabContainer';
import BaseManager from '../../plugin/mvc/managers/BaseManager';
import LNode from '../../plugin/mvc/prefabs/LNode';
import LMouseEvent from '../../plugin/lufylegend/events/LMouseEvent';
import LPoint from '../../plugin/lufylegend/geom/LPoint';
import LEvent from '../../plugin/lufylegend/events/LEvent';
import EventManager from '../managers/EventManager';
class BattleCardListView extends BaseBindView {
    init(data) {
        super.init(data);
        this.dragChild = null;
        EventManager.addEventListener('card:back', this._cardBack, this);
        EventManager.addEventListener('card:change', this._cardChange, this);
    }
    die() {
        super.die();
        EventManager.removeEventListener('card:back', this._cardBack);
        EventManager.removeEventListener('card:change', this._cardChange);
    }
    updateView() {
        super.updateView();
        let value = this.getByPath(this.bind.key);
        if (value === null) {
            return;
        }
        let childPrefab = this.bind.childPrefab;
        
        return BaseManager.loadPrefab(childPrefab)
            .then((data) => {
                for (let child of value) {
                    this.createListObject(data, child);
                }
                this.addEventListener(LMouseEvent.MOUSE_DOWN, this._touchCard, this);
                this.addEventListener(LMouseEvent.MOUSE_UP, this._touchEnd, this);
            });
    }
    createListObject(data, model) {
        let node = LNode.create(data);
        node.x = this.numChildren * 100;
        node.updateWidget(model);
        this.addChild(node);
        if (this.numChildren > 4) {
            node.visible = false;
        }
    }
    _touchCard(event) {
        let child = event.target;
        child.startDrag(event.touchPointID);
        this.dragChild = child;
        this.savePoint = new LPoint(child.x, child.y);
    }
    _touchEnd(event) {
        if (!this.dragChild) {
            return;
        }
        this.dragChild.stopDrag();
        let e = new LEvent('card:dragEnd');
        e.card = this.dragChild;
        e.x = event.offsetX;
        e.y = event.offsetY;
        EventManager.dispatchEvent(e);
    }
    _cardBack(event) {
        this.dragChild.x = this.savePoint.x;
        this.dragChild.y = this.savePoint.y;
        this.dragChild = null;
    }
    _cardChange(event) {
        let child = this.getChildAt(4);
        this.setChildIndex(this.dragChild, 7);
        this.dragChild.visible = false;
        child.visible = true;
        child.x = this.savePoint.x;
        child.y = this.savePoint.y;
        this.dragChild = null;
    }
}
PrefabContainer.set('BattleCardListView', BattleCardListView);
export default BattleCardListView;