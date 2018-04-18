
class FBIManager {
    constructor() {
        
    }
    
    get currentContextID() {
        return this._currentContextID;
    }
    get contextType() {
        return window.FBInstant.context.getType();
    }
    get playerId() {
        return window.FBInstant ? window.FBInstant.player.getID() : null;
    }
  
    get playerName() {
        return window.FBInstant ? window.FBInstant.player.getName() : null;
    }
  
    get playerPhoto() {
        return window.FBInstant ? window.FBInstant.player.getPhoto() : null;
    }
    initializeAsync() {
        return window.FBInstant.initializeAsync();
    }
    start() {
        if (window.FBInstant) {
            window.FBInstant.onPause(this._onPauseCallback.bind(this));
            return window.FBInstant.startGameAsync().then(() => {
                //this.setSessionData('playerId', this.playerId);
                this._currentContextID = window.FBInstant.context.getID();
                this._entryPointData = window.FBInstant.getEntryPointData();
            });
        } else {
            return Promise.resolve();
        }
    }
}
export default new FBIManager();