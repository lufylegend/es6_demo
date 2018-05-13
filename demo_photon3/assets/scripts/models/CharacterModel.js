import ConfigManager from '../managers/ConfigManager';

class CharacterModel {
    constructor(id, level) {
        this.id = id;
        this.level = level;
        this.data = ConfigManager.get('characters').find((child) => {
            return child.id === this.id;
        });
        this._init();
    }
    _init() {
        
    }
    get width() {
        return this.data.width;
    }
    get height() {
        return this.data.height;
    }
    get y() {
        return this.data.y;
    }
    get speed() {
        return this.data.speed;
    }
}
export default CharacterModel;