import LURLLoader from '../../plugin/lufylegend/net/LURLLoader';
import LEvent from '../../plugin/lufylegend/events/LEvent';

class ConfigManager {
    constructor() {
        this._configs = {};
    }
    loadConfig(fileName) {
        if (this._configs[fileName]) {
            return Promise.resolve();
        }
        return new Promise((resolve, reject) => {
            let loader = new LURLLoader();
            loader.addEventListener(LEvent.COMPLETE, (event) => {
                this._configs[fileName] = JSON.parse(event.target);
                resolve();
            });
            loader.load(`./resources/configs/${fileName}.json`, LURLLoader.TYPE_TEXT);
        });
    }
    get(fileName) {
        return this._configs[fileName];
    }
}
export default new ConfigManager();