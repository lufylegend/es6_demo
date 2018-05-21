import PrefabContainer from '../../../plugin/mvc/prefabs/PrefabContainer';
import PanelController from '../../../plugin/mvc/controllers/PanelController';
import BaseManager from '../../../plugin/mvc/managers/BaseManager';
//import ConfigManager from '../../managers/ConfigManager';
class HomePanelController extends PanelController {
    onLoad() {
        super.onLoad();
        this.dispatcher.title = 'Home测试';
    }
    showRankingDialog() {
        BaseManager.showDialog('prefabs/dialog/RankingDialog');
    }
    gotoBattle() {
        BaseManager.loadScene('prefabs/scene/Battle');
    }
}
PrefabContainer.set('HomePanelController', HomePanelController);
export default HomePanelController;