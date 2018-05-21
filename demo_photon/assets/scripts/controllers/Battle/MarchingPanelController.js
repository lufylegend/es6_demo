import PrefabContainer from '../../../plugin/mvc/prefabs/PrefabContainer';
import PanelController from '../../../plugin/mvc/controllers/PanelController';
import BaseManager from '../../../plugin/mvc/managers/BaseManager';
import masterClient from '../../utils/MasterClient';
import LEvent from '../../../plugin/lufylegend/events/LEvent';

class MarchingPanelController extends PanelController {
    onLoad(request) {
        super.onLoad(request);
    }
    onLoadEnd() {
        super.onLoadEnd();
        this.addEventListener(LEvent.ENTER_FRAME, this._spinnerRun, this);
        setTimeout(() => {
            this.startSearch();
        }, 100);
        console.log('MarchingPanelController onLoadEnd');
    }
    die() {
        super.die();
        this.removeEventListener(LEvent.ENTER_FRAME, this._spinnerRun);
    }
    startSearch() {
        let key = 100000000 * Math.random() >>> 0;
        let id = `id.${key}`;
        let name = `name.${key}`;
        masterClient.ai = false;
        masterClient.start(id, name, {});
    }
    _spinnerRun(event) {
        this.spinner.rotate += 5;
    }
    gotoTopScene(event, param) {
        BaseManager.loadScene('prefabs/Scene/Top');
    }
}
PrefabContainer.set('MarchingPanelController', MarchingPanelController);
export default MarchingPanelController;