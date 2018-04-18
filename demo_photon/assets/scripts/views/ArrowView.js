import LSprite from '../../plugin/lufylegend/display/LSprite';
import LAtlas from '../../plugin/lufylegend/system/LAtlas';
import LSpriteAtlasType from '../../plugin/lufylegend/system/LSpriteAtlasType';
export const Direction = {
    LEFT: 'left',
    RIGHT: 'right',
    UP: 'up',
    DOWN: 'down'
};
const ArrowProperty = {
    'left': {
        rotate: 0,
        x: 0,
        y: 0
    },
    'up': {
        rotate: 90,
        x: 1,
        y: 0
    },
    'right': {
        rotate: 180,
        x: 1,
        y: 1
    },
    'down': {
        rotate: 270,
        x: 0,
        y: 1
    }
};
class ArrowView extends LSprite {
    constructor() {
        super();
        let atlas = LAtlas.get('atlas/ui');
        this._spriteOff = atlas.getSprite('arrow_off', LSpriteAtlasType.SIMPLE, 100, 100);
        this.addChild(this._spriteOff);
        this._spriteOn = atlas.getSprite('arrow_on', LSpriteAtlasType.SIMPLE, 100, 100);
        this.addChild(this._spriteOn);
        this._spriteOn.visible = false;
    }
    get isOff() {
        return this._spriteOff.visible;
    }
    off() {
        this._spriteOff.visible = true;
        this._spriteOn.visible = false;
    }
    on() {
        this._spriteOff.visible = false;
        this._spriteOn.visible = true;
    }
    resize(size) {
        this.size = size;
        this._spriteOff.resize(size, size);
        this._spriteOn.resize(size, size);
    }
    set direction(value) {
        this._direction = value;
        let property = ArrowProperty[value];
        this._spriteOff.rotate = property['rotate'];
        this._spriteOn.rotate = property['rotate'];
        this._spriteOff.x = this.size * property['x'];
        this._spriteOff.y = this.size * property['y'];
        this._spriteOn.x = this.size * property['x'];
        this._spriteOn.y = this.size * property['y'];
    }
    get direction() {
        return this._direction;
    }
}
export default ArrowView;