import ArrowListView from './ArrowListView';
import LEvent from '../../plugin/lufylegend/events/LEvent';
import LGlobal from '../../plugin/lufylegend/utils/LGlobal';
const directions = ['left', 'up', 'right', 'down'];
const SPEED = 2;
class CharacterArrowListView extends ArrowListView {
    constructor(list, size, characterView) {
        super(list, size);
        this.characterView = characterView;
        console.error(this.characterView);
        this.addEventListener(LEvent.ENTER_FRAME, () => {
            this.onFrame();
        });
    }
    onFrame() {
        if (this.numChildren === 0 || this.x <= -this.getWidth()) {
            this.init();
            return;
        }
        this.x -= SPEED;
    }
    get isReady() {
        return this.childList.findIndex((child) => child.isOff) < 0;
    }
    checkDraw(inputView) {
        let inputChildList = inputView.childList;
        this.childList.forEach((child) => {
            child.off();
        });
        for (let i = 0;i < inputChildList.length;i++) {
            if (i > this.numChildren - 1) {
                break;
            }
            if (this.childList[i].direction !== inputChildList[i].direction) {
                this.childList.forEach((child) => {
                    child.off();
                });
                break;
            }
            this.childList[i].on();
        }
    }
    attack(enemy) {
        this.characterView.attack(enemy);
        this.init();
    }
    init() {
        this.x = LGlobal.width;
        this.clear();
        this.characterView.changeSkill();
        let num = this.characterView.skill.num;
        for (let i = 0;i < num;i++) {
            let direction = directions[directions.length * Math.random() >>> 0];
            this.add(direction, 72);
        }
    }
}
export default CharacterArrowListView;