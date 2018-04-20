import LEventDispatcher from '../../plugin/lufylegend/events/LEventDispatcher';
import LEvent from '../../plugin/lufylegend/events/LEvent';
import AIClient from './AIClient';
export const ClientEvent = {
    ROOM_IN: 1, //进入战斗房间
    READY: 2, //战斗画面准备OK
    ATTACK: 3,
};
class MasterClient extends LEventDispatcher {
    /*gameStart() {
        let event = new LEvent('game:start');
        event.enemyPlayer = this.enemy;
        this.dispatchEvent(event);
    }*/
    onEvent(code, content, actorNr) {
        console.error('MasterClient', code, content);
        let event;
        switch (code) {
        case ClientEvent.ATTACK:
            console.error('this.client.myActor().getId()=' + this.client.myActor().getId());
            console.error('content.id=' + content.id);
            if (this.client.myActor().getId() !== content.id) {
                event = new LEvent('enemy:attack');
                event.index = content.index;
                event.hert = content.hertValue;
                this.dispatchEvent(event);
            }
            break;
        }
    }
    get enemy() {
        return this.client.myRoomActorsArray()[1];
    }
    get player() {
        return this.client.myRoomActorsArray()[0];
    }
    get playerId() {
        return this.player.id;
    }
    get enemyId() {
        return this.enemy.id;
    }
    attack(index, hertValue) {
        this.client.raiseEventAll(ClientEvent.ATTACK, { 'id': this.client.myActor().getId(), index: index, hertValue: hertValue });
    }
    start(id, name, data) {
        this.client.start(id, name, data);
    }
    setClient(photonClient, aiClient) {
        this.photonClient = photonClient;
        this.aiClient = aiClient;
    }
    set ai(value) {
        this.client = value ? this.aiClient : this.photonClient;
    }
}
let masterClient = new MasterClient();
let photonClient = new window.PhotonClient(masterClient);
let aiClient = new AIClient(masterClient);
masterClient.setClient(photonClient, aiClient);
export default masterClient;