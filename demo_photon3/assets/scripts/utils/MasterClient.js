import LEventDispatcher from '../../plugin/lufylegend/events/LEventDispatcher';
import LEvent from '../../plugin/lufylegend/events/LEvent';
import AIClient from './AIClient';
export const ClientEvent = {
    READY: 1, //单方战斗画面准备OK
    SHOOT: 2,
    ATTACK: 3,
};
export const GameEvent = {
    ROOM_IN: 'roomIn', //进入战斗房间
    GAME_INIT: 'gameInit', //双方准备OK
};
class MasterClient extends LEventDispatcher {
    gameStart() {
        let event = new LEvent(GameEvent.ROOM_IN);
        event.enemyPlayer = this.enemy;
        this.dispatchEvent(event);
    }
    onEvent(code, content, actorNr) {
        console.error('MasterClient', code, content);
        let event;
        switch (code) {
        case ClientEvent.SHOOT:
            console.error('this.client.myActor().getId()=' + this.client.myActor().getId());
            console.error('content.id=' + content.id);
            if (this.client.myActor().getId() !== content.id) {
                event = new LEvent('ball:sendout');
                event.params = content.params;
                this.dispatchEvent(event);
            }
            break;
        case ClientEvent.READY:
            if (this.client.myActor().getId() !== content.id) {
                this.client.myActor().setCustomProperty('ready', true);
            }
            if (this.player.getCustomProperty('ready') && this.enemy.getCustomProperty('ready')) {
                event = new LEvent(GameEvent.GAME_INIT);
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
    shoot(event) {
        this.client.raiseEventAll(ClientEvent.SHOOT, { 'id': this.client.myActor().getId(), params: event.params });
    }
    attack(index, hertValue) {
        this.client.raiseEventAll(ClientEvent.ATTACK, { 'id': this.client.myActor().getId(), index: index, hertValue: hertValue });
    }
    battleReady() {
        this.client.raiseEventAll(ClientEvent.READY, { 'id': this.client.myActor().getId() });
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