import PrefabContainer from '../../../plugin/mvc/prefabs/PrefabContainer';
import PanelController from '../../../plugin/mvc/controllers/PanelController';
//import BaseManager from '../../../plugin/mvc/managers/BaseManager';
import masterClient from '../../utils/MasterClient';

class BattlePanelController extends PanelController {
    onLoad(request) {
        super.onLoad(request);
        this.dispatcher.cards = [
            { id: 1, name: '老虎', icon: 'dog', cost: 3 }, 
            { id: 2, name: '狮子', icon: 'dragon', cost: 5 }, 
            { id: 3, name: '狮子', icon: 'goat', cost: 2 }, 
            { id: 4, name: '狮子', icon: 'horse', cost: 3 },
            { id: 5, name: '老虎', icon: 'monkey', cost: 3 }, 
            { id: 6, name: '狮子', icon: 'ox', cost: 5 }, 
            { id: 7, name: '狮子', icon: 'pig', cost: 2 }, 
            { id: 8, name: '狮子', icon: 'rabbit', cost: 3 }
        ];
        console.log('BattlePanelController onLoad');
    }
    onLoadEnd() {
        super.onLoadEnd();
        console.log('BattlePanelController onLoadEnd', this.battleCardListView);
        masterClient.battleReady();
    }
}
PrefabContainer.set('BattlePanelController', BattlePanelController);
export default BattlePanelController;