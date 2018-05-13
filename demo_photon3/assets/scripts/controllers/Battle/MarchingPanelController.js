import PrefabContainer from '../../../plugin/mvc/prefabs/PrefabContainer';
import PanelController from '../../../plugin/mvc/controllers/PanelController';
import BaseManager from '../../../plugin/mvc/managers/BaseManager';
import masterClient, { GameEvent } from '../../utils/MasterClient';
import LEvent from '../../../plugin/lufylegend/events/LEvent';

class MarchingPanelController extends PanelController {
    onLoad(request) {
        super.onLoad(request);
    }
    onLoadEnd() {
        super.onLoadEnd();
        masterClient.addEventListener(GameEvent.ROOM_IN, this.roomIn, this);
        let key = 100000000 * Math.random() >>> 0;
        let id = `id.${key}`;
        let name = `name.${key}`;
        masterClient.ai = false;
        masterClient.start(id, name, {});
        console.log('MarchingPanelController onLoadEnd');
        this.addEventListener(LEvent.ENTER_FRAME, this.spinnerRun, this);
    }
    spinnerRun(event) {
        this.spinner.rotate += 5;
    }
    roomIn() {
        masterClient.removeEventListener(GameEvent.ROOM_IN, this.roomIn);
        console.log(this.sceneController);
        this.sceneController.roomIn();
    }
    gotoTopScene(event, param) {
        BaseManager.loadScene('prefabs/Scene/Top');
    }
}
PrefabContainer.set('MarchingPanelController', MarchingPanelController);
export default MarchingPanelController;