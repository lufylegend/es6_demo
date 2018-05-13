import PrefabContainer from '../../../plugin/mvc/prefabs/PrefabContainer';
import SceneController from '../../../plugin/mvc/controllers/SceneController';
import BaseManager from '../../../plugin/mvc/managers/BaseManager';

class BattleSceneController extends SceneController {
    onLoad(request) {
        super.onLoad(request);
    }
    onLoadEnd() {
        super.onLoadEnd();
        BaseManager.loadPanel('prefabs/panel/Battle');
        //BaseManager.loadPanel('prefabs/panel/Marching');
    }
    roomIn() {
        BaseManager.loadPanel('prefabs/panel/Battle');
    }
    gotoTopScene(event, param) {
        BaseManager.loadScene('prefabs/Scene/Top');
    }
}
PrefabContainer.set('BattleSceneController', BattleSceneController);
export default BattleSceneController;