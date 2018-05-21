import PrefabContainer from '../../../plugin/mvc/prefabs/PrefabContainer';
import SceneController from '../../../plugin/mvc/controllers/SceneController';
import BaseManager from '../../../plugin/mvc/managers/BaseManager';
import masterClient, { GameEvent } from '../../utils/MasterClient';

class BattleSceneController extends SceneController {
    onLoad(request) {
        super.onLoad(request);
    }
    onLoadEnd() {
        super.onLoadEnd();
        masterClient.addEventListener(GameEvent.ROOM_IN, this._roomIn, this);
        BaseManager.loadPanel('prefabs/panel/Marching');
    }
    die() {
        super.die();
        masterClient.removeEventListener(GameEvent.ROOM_IN, this._roomIn);
    }
    _roomIn() {
        masterClient.removeEventListener(GameEvent.ROOM_IN, this._roomIn);
        BaseManager.loadPanel('prefabs/panel/Battle');
    }
    gotoTopScene(event, param) {
        BaseManager.loadScene('prefabs/scene/Top');
    }
}
PrefabContainer.set('BattleSceneController', BattleSceneController);
export default BattleSceneController;