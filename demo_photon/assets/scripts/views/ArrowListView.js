import ArrowManager from '../managers/ArrowManager';
import LSprite from '../../plugin/lufylegend/display/LSprite';
class ArrowListView extends LSprite {
    constructor(list, size) {
        super();
        this.addList(list, size);
    }
    addList(list, size) {
        for (let i = 0;i < list.length;i++) {
            this.add(list[i], size);
        }
    }
    add(direction, size) {
        let arrow = ArrowManager.get();
        arrow.resize(size);
        arrow.direction = direction;
        arrow.x = this.numChildren * size;
        this.addChild(arrow);
    }
    clear() {
        while (this.numChildren > 0) {
            let child = this.getChildAt(0);
            child.off();
            ArrowManager.push(child);
        }
    }
}
export default ArrowListView;