
import BaseBindView from '../../plugin/mvc/views/BaseBindView';
import PrefabContainer from '../../plugin/mvc/prefabs/PrefabContainer';
import BaseManager from '../../plugin/mvc/managers/BaseManager';
import LNode from '../../plugin/mvc/prefabs/LNode';
import LMouseEvent from '../../plugin/lufylegend/events/LMouseEvent';
import masterClient from '../utils/MasterClient';
class BattleIconListView extends BaseBindView {
    init(data) {
        super.init(data);
    }
    die() {
        super.die();
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
                this.addEventListener(LMouseEvent.MOUSE_DOWN, this._clickCard, this);
            });
    }
    createListObject(data, model) {
        let node = LNode.create(data);
        node.x = this.numChildren * 60;
        node.updateWidget(model);
        this.addChild(node);
    }
    _clickCard(event) {
        let child = event.target;
        masterClient.sendIcon(child.model.icon);
    }
}
PrefabContainer.set('BattleIconListView', BattleIconListView);
export default BattleIconListView;