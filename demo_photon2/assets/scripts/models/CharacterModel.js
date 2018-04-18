import ConfigManager from '../managers/ConfigManager';

class CharacterModel {
    constructor(id, level) {
        this.id = id;
        this.level = level;
        this.data = ConfigManager.get('characters').find((child) => {
            return child.id === this.id;
        });
        this.init();
    }
    init() {
        
    }

}
export default CharacterModel;