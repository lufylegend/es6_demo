import LEventDispatcher from '../../plugin/lufylegend/events/LEventDispatcher';
import LEvent from '../../plugin/lufylegend/events/LEvent';
import AIClient from './AIClient';
export const ClientEvent = {
    READY: 1, //单方战斗画面准备OK
    SHOOT: 2, //打球
    BOUT_OVER: 3, //回合胜利
    SEND_ICON: 4, //发送表情
    ENEMY_MOVE: 5, //敌人移动
};
export const GameEvent = {
    ROOM_IN: 'roomIn', //进入战斗房间
    GAME_INIT: 'gameInit', //双方准备OK
    BOUT_WIN: 'boutWin', //回合胜利
    BOUT_FAIL: 'boutFail', //回合失败
    SEND_ICON: 'sendIcon', //发送表情
};
class MasterClient extends LEventDispatcher {
    constructor() {
        super();
        this._diffMilliseconds = [];
    }
    gameStart() {
        let event = new LEvent(GameEvent.ROOM_IN);
        event.enemyPlayer = this.enemy;
        this.dispatchEvent(event);
    }
    onEvent(code, content, actorNr) {
        //console.error('MasterClient', code, content, 'isLeader=' + this.isLeader);
        if (this.client.myActor().getId() !== content.id) {
            this.synchronisedTime(content.now);
        }
        let event;
        switch (code) {
        case ClientEvent.SEND_ICON:
            event = new LEvent(GameEvent.SEND_ICON);
            event.icon = content.icon;
            event.id = content.id;
            this.dispatchEvent(event);
            break;
        case ClientEvent.BOUT_OVER:
            this.dispatchEvent(this.client.myActor().getId() !== content.id ? GameEvent.BOUT_WIN : GameEvent.BOUT_FAIL);
            break;
        case ClientEvent.ENEMY_MOVE:
            if (this.client.myActor().getId() !== content.id) {
                event = new LEvent('enemy:move');
                event.x = content.x;
                this.dispatchEvent(event);
            }
            break;
        case ClientEvent.SHOOT:
            //console.error('this.client.myActor().getId()=' + this.client.myActor().getId());
            //console.error('content.id=' + content.id);
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
    synchronisedTime(now) {
        if (!now) {
            return;
        }
        this._diffMilliseconds.push(Date.now() - now);
        if (this._diffMilliseconds.length > 20) {
            this._diffMilliseconds.shift();
        }
        let sum = 0;
        for (let i = 0;i < this._diffMilliseconds.length;i++) {
            sum += this._diffMilliseconds[i];
        }
        //时间差定为最后二十次通信的平均值
        this._diffMillisecond = sum / this._diffMilliseconds.length;
    }
    get diffMillisecond() {
        return this._diffMillisecond || 0;
    }
    get now() {
        if (!this.isLeader) {
            return Date.now() - this._diffMillisecond;
        }
        return Date.now();
    }
    get isLeader() {
        return this.client.myActor().isLeader();
    }
    get enemy() {
        return this.client.myRoomActorsArray()[1];
    }
    get player() {
        return this.client.myRoomActorsArray()[0];
    }
    get playerId() {
        return this.player.getId();
    }
    get enemyId() {
        return this.enemy.getId();
    }
    shoot(event) {
        this.sendMessage(ClientEvent.SHOOT, { 'id': this.client.myActor().getId(), params: event.params });
    }
    battleReady() {
        this.sendMessage(ClientEvent.READY, { 'id': this.client.myActor().getId() });
    }
    boutOver() {
        this.sendMessage(ClientEvent.BOUT_OVER, { 'id': this.client.myActor().getId() });
    }
    sendIcon(icon) {
        this.sendMessage(ClientEvent.SEND_ICON, { 'id': this.client.myActor().getId(), 'icon': icon });
    }
    enemyMove(x) {
        this.sendMessage(ClientEvent.ENEMY_MOVE, { 'id': this.client.myActor().getId(), 'x': x });
    }
    sendMessage(eventCode, data, options) {
        data.now = Date.now();
        this.client.raiseEventAll(eventCode, data, options);
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