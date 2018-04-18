
import BaseBindView from '../../plugin/mvc/views/BaseBindView';
import PrefabContainer from '../../plugin/mvc/prefabs/PrefabContainer';
import BaseManager from '../../plugin/mvc/managers/BaseManager';
import LNode from '../../plugin/mvc/prefabs/LNode';
class BattleCharacterListView extends BaseBindView {
    init() {
        super.init();
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
            });
    }
    createListObject(data, model) {
        let node = LNode.create(data);
        node.x = this.numChildren * 120;
        node.updateWidget(model);
        this.addChild(node);
    }
}
PrefabContainer.set('BattleCharacterListView', BattleCharacterListView);
export default BattleCharacterListView;