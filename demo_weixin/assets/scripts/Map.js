import LSprite from '../plugin/lufylegend/display/LSprite';
import LEvent from '../plugin/lufylegend/events/LEvent';
import { common } from './common';
import StageData from './StageData';
import Floor from './Floor';

/**
 * @author lufy
 */
class Map extends LSprite {
    constructor() {
        super();
        this.init();
    }
    init() {
        let self = this;
        self.dieFloorList = [];
        self.addFloor(2);
        self.floor.x = 0;
        self.addEventListener(LEvent.ENTER_FRAME, self.onframe);
    }
    onframe(event) {
        let self = event.target;
        if (common.gameBody.isStop()) return;
        while (self.dieFloorList.length > 0) {
            let child = self.dieFloorList.shift();
            self.removeChild(child);
        }
    }
    addFloor(index) {
        let self = this;
        self.floor = StageData.getFloor(index);
        self.addChild(self.floor);
        self.floor.addEventListener(Floor.OUT_COMPLETE, self.getFloor);
        self.floor.addEventListener(Floor.OUT_DIE, self.addDieFloor);
    }
    getFloor(event) {
        let self = event.target.parent;
        self.floor.removeEventListener(Floor.OUT_COMPLETE, self.getFloor);
		
        self.addFloor(1);
    }
    addDieFloor(event) {
        let self = event.target.parent;
        self.dieFloorList.push(event.target);
    }
}
export default Map;