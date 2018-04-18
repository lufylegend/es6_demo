import ArrowView from '../views/ArrowView';
import LGlobal from '../../plugin/lufylegend/utils/LGlobal';
class ArrowManager {
    constructor() {
        this.pool = [];
    }
    get() {
        let arrow;
        if (this.pool.length > 0) {
            arrow = this.pool.shift();
        } else {
            arrow = new ArrowView();
        }
        return arrow;
    }
    push(arrow) {
        LGlobal.destroy = false;
        arrow.remove();
        this.pool.push(arrow);
        LGlobal.destroy = true;
    }
}
export default new ArrowManager();