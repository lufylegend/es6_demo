import AIPlayer from './AIPlayer';
import LEvent from '../../plugin/lufylegend/events/LEvent';

class AIClient {
    constructor(masterClient) {
        this.masterClient = masterClient;
        this._init();
    }
    _init() {
        this.aiPlayer = new AIPlayer();
        this._myRoomActorsArray = [];
        this._myRoomActorsArray.push(this.myActor());
        this._myRoomActorsArray.push(this.aiPlayer.actor);
    }
    onEvent(code, content, actorNr) {
        this.masterClient.onEvent(code, content, actorNr);
        this.aiPlayer.onEvent(code, content, actorNr);
    }
    start(id, name, data) {
        this.myActor().setInfo(id, name, data);
        this.connectToRegionMaster('EU');
    }
    connectToRegionMaster(region) {
        this.masterClient.gameStart();
        this.aiPlayer.gameStart();
    }
    myRoomActorsArray() {
        return this._myRoomActorsArray;
    }
    get enemy() {
        return this.client.myRoomActorsArray()[1];
    }
    get player() {
        return this.client.myRoomActorsArray()[0];
    }
    myActor() {
        this._myActor = this._myActor || new window.PhotonPlayer();
        return this._myActor;
    }
}
export default AIClient;