import BaseBindView from './BaseBindView';
import LAtlas from '../../lufylegend/system/LAtlas';
import PrefabContainer from '../prefabs/PrefabContainer';
import LShape from '../../lufylegend/display/LShape';
class BindSpriteView extends BaseBindView {
    init(data) {
        super.init(data);
        if (!this.sprite) {
            this.sprite = {
                'type': 'simple',
                'width': 0,
                'height': 0
            };
        }
        if (this.bind.default) {
            this._updateSprite(this.bind.default);
        }
    }
    resize(width, height) {
        this.sprite.width = width;
        this.sprite.height = height;
        this.getChildAt(0).resize(width, height);
        this.clearShape();
        this.addShape(LShape.RECT, [0, 0, width, height]);
    }
    updateView() {
        super.updateView();
        if (!this.bind || !this.bind.key) {
            return;
        }
        let value = this.getByPath(this.bind.key);
        if (value === null) {
            return;
        }
        this._updateSprite(value);
    }
    _updateSprite(value) {
        let atlas = LAtlas.get(this.bind.atlas);
        this.removeAllChild();
        let sprite = atlas.getSprite(value, this.sprite.type, this.sprite.width, this.sprite.height);
        if (sprite) {
            this.addChild(sprite);
            this.addShape(LShape.RECT, [0, 0, this.sprite.width, this.sprite.height]);
        }
    }
}
PrefabContainer.set('BindSpriteView', BindSpriteView);
export default BindSpriteView;