import BaseController from './BaseController';
import SceneController from './SceneController';
class PanelController extends BaseController {
    get sceneController() {
        let scene = this;
        while (scene) {
            if (scene instanceof SceneController) {
                return scene;
            }
            scene = scene.parent;
            if (typeof scene !== 'object') {
                break;
            }
        }
        return null;
    }
}
export default PanelController;