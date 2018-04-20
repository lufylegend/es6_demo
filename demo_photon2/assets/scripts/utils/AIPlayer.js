//import { ClientEvent } from './MasterClient';

class AIPlayer {
    constructor() {
        this._photonPlayer = new window.PhotonPlayer();
    }
    get actor() {
        return this._photonPlayer;
    }
    gameStart() {
        
    }
    onEvent(code, content, actorNr) {
        
        /*console.error('MasterClient', code, content);
        let event;
        switch (code) {
        case ClientEvent.ATTACK:
            console.error('this.client.myActor().getId()=' + this.client.myActor().getId());
            console.error('content.id=' + content.id);
            if (this._photonPlayer.getId() !== content.id) {
                event = new LEvent('enemy:attack');
                event.index = content.index;
                event.hert = content.hertValue;
                this.dispatchEvent(event);
            }
            break;
        }*/
    }
}
export default AIPlayer;