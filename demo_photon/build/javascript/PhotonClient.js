const GLOBAL_ROOM_NAME = 'GlobalRoom (XXX Game)';
//const GLOBAL_ROOM_NAME = 'DemoPairsGame (Master Client)';
let AppInfo = {
    //	Wss: true,
    AppId: '6915e697-bc86-4518-9e90-ac2b5ad7800c',
    AppVersion: '1.0',
    //    FbAppId: "you fb app id", 
};
let __photon_extends = (this && this.__extends) || (function() {
    let extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function(d, b) {
            d.__proto__ = b;
        }) ||
        function(d, b) {
            for (let p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        };
    return function(d, b) {
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
const PhotonEvent = {
    BUILD: 101,
    BATTLE_START: 102
};
let PhotonClient = (function(_super) {
    __photon_extends(PhotonClient, _super);
    function PhotonClient(masterClicent) {
        let _this = _super.call(this, window.Photon.ConnectionProtocol.Ws, AppInfo.AppId, AppInfo.AppVersion) || this;
        _this.logger = new window.Exitgames.Common.Logger('PhotonClient:', window.Exitgames.Common.Logger.Level.DEBUG);
        console.warn('Init', AppInfo.AppId, AppInfo.AppVersion);
        _this.masterClicent = masterClicent;
        _this.logger.info('Init', AppInfo.AppId, AppInfo.AppVersion);
        _this.setLogLevel(window.Exitgames.Common.Logger.Level.DEBUG);
        return _this;
    }
    PhotonClient.prototype.raiseEventAll = function(eventCode, data, options) {
        options = options || {};
        console.error('raiseEventAll', eventCode, data, options);
        options.receivers = window.Photon.LoadBalancing.Constants.ReceiverGroup.All;
        this.raiseEvent(eventCode, data, options);
    };
    PhotonClient.prototype.roomFactory = function(name) {
        return new PhotonRoom(this, name);
    };
    PhotonClient.prototype.actorFactory = function(name, actorNr, isLocal) {
        return new PhotonPlayer(this, name, actorNr, isLocal);
    };
    PhotonClient.prototype.myRoom = function() {
        return _super.prototype.myRoom.call(this);
    };
    PhotonClient.prototype.myActor = function() {
        return _super.prototype.myActor.call(this);
    };
    PhotonClient.prototype.myRoomActors = function() {
        return _super.prototype.myRoomActors.call(this);
    };
    PhotonClient.prototype.createPhotonClientRoom = function(name) {
        console.error('createPhotonClientRoom New Game');
        this.myRoom().setEmptyRoomLiveTime(10000);
        this.createRoomFromMy(name || GLOBAL_ROOM_NAME);
    };
    PhotonClient.prototype.start = function(id, name, enemys) {
        let self = this;
        self.myActor().setInfo(id, name, enemys);
        //self.myActor().setCustomProperty('auth', { enemys: enemys });
        self.connectToRegionMaster('EU');
    };
    PhotonClient.prototype.onError = function(errorCode, errorMsg) {
        console.warn('onError', errorCode, errorMsg);
        // optional super call
        _super.prototype.onError.call(this, errorCode, errorMsg);
    };
    PhotonClient.prototype.onOperationResponse = function(errorCode, errorMsg, code, content) {
        console.warn('onOperationResponse', errorCode, errorMsg, code, content);
        if (errorCode) {
            switch (code) {
            case window.Photon.LoadBalancing.Constants.OperationCode.JoinRandomGame:
                switch (errorCode) {
                case window.Photon.LoadBalancing.Constants.ErrorCode.NoRandomMatchFound:
                    console.warn('Join Random:', errorMsg);
                    this.createPhotonClientRoom();
                    break;
                default:
                    console.warn('Join Random:', errorMsg);
                    break;
                }
                break;
            case window.Photon.LoadBalancing.Constants.OperationCode.CreateGame:
                if (errorCode !== 0) {
                    console.warn('CreateGame:', errorMsg);
                    this.disconnect();
                }
                break;
            case window.Photon.LoadBalancing.Constants.OperationCode.JoinGame:
                if (errorCode !== 0) {
                    console.warn('CreateGame:', errorMsg);
                    let self = this;
                    if (this.myActor().isLeader()) {
                        setTimeout(function() {
                            self.joinRoom(self.myActor().getBattleRoom());
                        }, 200);
                    } else {
                        this.createPhotonClientRoom();
                    }

                    //this.disconnect();
                }
                break;
            default:
                console.warn('Operation Response error:', errorCode, errorMsg, code, content);
                break;
            }
        }

    };
    PhotonClient.prototype.onEvent = function(code, content, actorNr) {
        console.warn('----------onEvent', code, content, actorNr);
        switch (code) {
        case PhotonEvent.BUILD:
            if (this.myActor().getId() === content.id) {
                this.myActor().setCustomProperty('target', content.target);
                this.myActor().setCustomProperty('battleRoom', content.battleRoom);
                this.leaveRoom();
            }
            break;
        case PhotonEvent.BATTLE_START:
            if (this.timeFlag) {
                clearTimeout(this.timeFlag);
                this.timeFlag = null;
            }
            console.error('------------battle start----------');
            if (this.masterClicent && this.masterClicent.gameStart) {
                this.masterClicent.gameStart();
            }
            break;
        default:
            break;
        }
        if (this.masterClicent && this.masterClicent.onEvent) {
            this.masterClicent.onEvent(code, content, actorNr);
        }
    };
    PhotonClient.prototype.onStateChange = function(state) {
        //this.masterClient.onStateChange(state);
        // "namespace" import for static members shorter acceess
        let LBC = window.Photon.LoadBalancing.LoadBalancingClient;
        console.warn('onStateChange', state, LBC.State.JoinedLobby);
        switch (state) {
        case LBC.State.JoinedLobby:
            if (this.myActor().getTarget()) {
                if (this.myActor().isLeader()) {
                    this.joinRoom(this.myActor().getBattleRoom());
                } else {
                    this.createPhotonClientRoom(this.myActor().getBattleRoom());
                }
            } else {
                //console.warn(`this.joinRoom(${GLOBAL_ROOM_NAME});`);
                //this.joinRandomRoom();
                this.joinRoom(GLOBAL_ROOM_NAME);
            }
            break;
        default:
            break;
        }
    };
    PhotonClient.prototype._findMinNrActor = function() {
        let actorsArray = this.myRoomActorsArray();
        let acotr = actorsArray[0];
        for (let i = 1;i < actorsArray.length;i++) {
            let currentActor = actorsArray[i];
            if (acotr.getTime() > currentActor.getTime()) {
                acotr = currentActor;
            }
        }
        return acotr;
    };
    PhotonClient.prototype.searchBattleTarget = function() {
        let actorsArray = this.myRoomActorsArray();
        if (actorsArray.length >= 2) {
            let minActor = this._findMinNrActor();
            if (this.myActor().getId() === minActor.getId() && !this.myActor().isLeader()) {
                this.myActor().setCustomProperty('leader', true);
                this.myActor().setCustomProperty('target', actorsArray[1].getId());
                let battleRoom = this.myActor().getId() + '_' + actorsArray[0].getId();
                this.myActor().setCustomProperty('battleRoom', battleRoom);
                this.raiseEventAll(PhotonEvent.BUILD, { 'target': actorsArray[0].getId(), 'id': actorsArray[1].getId(), 'battleRoom': battleRoom });
                
            }
        }
    };
    PhotonClient.prototype.onJoinRoom = function() {
        //console.error('onJoinRoom myRoom', this.myRoom().name, this.myRoomActorsArray());
        if (this.myRoom().name !== GLOBAL_ROOM_NAME) {
            if (this.myRoomActorsArray().length === 2) {
                this.raiseEventAll(PhotonEvent.BATTLE_START, { });
            } else {
                let self = this;
                this.timeFlag = setTimeout(function() {
                    self.leaveRoom();
                }, 10000);
            }
        }
        /*
        console.warn('onJoinRoom myActor', this.myActor());
        console.warn('onJoinRoom myRoomActors', this.myRoomActors());
        this.logger.info('onJoinRoom myRoom', this.myRoom());
        this.logger.info('onJoinRoom myActor', this.myActor());
        this.logger.info('onJoinRoom myRoomActors', this.myRoomActors());
        this.raiseEventAll(111, { 'name': this.myActor().getName() });*/
    };
    PhotonClient.prototype.onActorJoin = function(actor) {
        console.warn('onActorJoin', actor, this.myRoom().name, this.myRoomActorsArray().length);
        if (this.myRoom().name === GLOBAL_ROOM_NAME) {
            this.searchBattleTarget();
        }
    };
    PhotonClient.prototype.onActorLeave = function(actor) {
        console.warn('onActorLeave', actor);
        if (actor.isLeader()) {
            this.searchBattleTarget();
        } else if (actor.getId() === this.myActor().getTarget() && this.myActor().isLeader()) {
            this.leaveRoom();
        }
    };
    PhotonClient.prototype.updatePlayerOnlineList = function() {
        console.warn('PhotonClient.prototype.updatePlayerOnlineList');
        /*for (let i in this.myRoomActors()) {
            let a = this.myRoomActors()[i];
            console.warn('actor(' + i + '):', a);
            this.logger.info('actor:', a.getName(), a.getTime());
        }*/
    };
    return PhotonClient;
})(window.Photon.LoadBalancing.LoadBalancingClient);

let PhotonRoom = (function(_super) {
    __photon_extends(PhotonRoom, _super);
    function PhotonRoom(client, name) {
        let _this = _super.call(this, name) || this;
        _this.client = client;
        
        return _this;
    }
    PhotonRoom.prototype.onPropertiesChange = function(changedCustomProps, byClient) {
        console.warn('PhotonRoom.prototype.onPropertiesChange', changedCustomProps, byClient);
    };
    return PhotonRoom;
}(window.Photon.LoadBalancing.Room));

let PhotonPlayer = (function(_super) {
    __photon_extends(PhotonPlayer, _super);
    function PhotonPlayer(client, name, actorNr, isLocal) {
        let _this = _super.call(this, name, actorNr, isLocal) || this;
        _this.client = client;
        return _this;
    }
    PhotonPlayer.prototype.isLeader = function() {
        return this.getCustomProperty('leader');
    };
    PhotonPlayer.prototype.getId = function() {
        return this.getCustomProperty('id');
    };
    PhotonPlayer.prototype.getName = function() {
        return this.getCustomProperty('name');
    };
    PhotonPlayer.prototype.getTarget = function() {
        return this.getCustomProperty('target');
    };
    PhotonPlayer.prototype.getBattleRoom = function() {
        return this.getCustomProperty('battleRoom');
    };
    PhotonPlayer.prototype.getTime = function() {
        return this.getCustomProperty('time');
    };
    PhotonPlayer.prototype.getData = function() {
        return this.getCustomProperty('data');
    };
    PhotonPlayer.prototype.onPropertiesChange = function(changedCustomProps) {
        if (this.isLocal) {
            document.title = this.getName() + ' / ' + this.getId() + ' Pairs Game (Master Client)';
        }
        this.client.updatePlayerOnlineList();
    };
    PhotonPlayer.prototype.init = function() {
        this.setCustomProperty('target', null);
        this.setCustomProperty('leader', false);
        this.setCustomProperty('time', Date.now());
    };
    PhotonPlayer.prototype.setInfo = function(id, name, data) {
        this.client.setUserId(id);
        this.setCustomProperty('id', id);
        this.setCustomProperty('name', name);
        this.setCustomProperty('data', data);
        this.init();
    };
    return PhotonPlayer;
}(window.Photon.LoadBalancing.Actor));
window.PhotonClient = PhotonClient;
/*
let loadBalancingClient;
window.onload = function() {
    loadBalancingClient = new PhotonClient();
    let rand = Math.random();
    loadBalancingClient.start('id-' + rand, 'name-' + rand);
};*/