

import LSprite from '../../plugin/lufylegend/display/LSprite';
import CharacterModel from '../models/CharacterModel';
import LEvent from '../../plugin/lufylegend/events/LEvent';
import LGlobal from '../../plugin/lufylegend/utils/LGlobal';
import LBitmapData from '../../plugin/lufylegend/display/LBitmapData';
//import LBitmap from '../../plugin/lufylegend/display/LBitmap';
import LAnimationTimeline from '../../plugin/lufylegend/display/LAnimationTimeline';
import LLoader from '../../plugin/lufylegend/display/LLoader';
import { Common } from '../utils/Common';
import LPoint from '../../plugin/lufylegend/geom/LPoint';
import LShape from '../../plugin/lufylegend/display/LShape';
export const DEFAULT_CHARACTER_IMG = 'character-default';
const SPEED = 4;
const BattleCharacterSize = {
    width: 48,
    height: 48
};
const CharacterAction = {
    /**
	 * 站立
	 **/
    STAND: 'stand',
    /**
	 * 移动
	 **/
    MOVE: 'move',
    /**
	 * 攻击
	 **/
    ATTACK: 'attack',
    /**
	 * 攻击开始
	 **/
    ATTACK_START: 'attack_start',
    /**
	 * 挡格
	 **/
    BLOCK: 'block',
    /**
	 * 受伤
	 **/
    HERT: 'hert',
    /**
	 * 觉醒
	 **/
    WAKE: 'wake',
    /**
	 * 喘气
	 **/
    PANT: 'pant',
    /**
	 * 升级
	 **/
    LEVELUP: 'levelup',
    /**
	 * 法攻
	 **/
    MAGIC_ATTACK: 'magic_attack'
};
const CharacterDirection = {
    DOWN: 'down',
    LEFT: 'left',
    RIGHT: 'right',
    UP: 'up'
};
const DirectionList = {
    '-1,0': CharacterDirection.LEFT,
    '0,-1': CharacterDirection.UP,
    '0,1': CharacterDirection.DOWN,
    '1,0': CharacterDirection.RIGHT
};
const CharacterActionEvent = {
    MOVE_COMPLETE: 'moveComplete',
    ATTACK_ACTION_COMPLETE: 'attackActionComplete',
    HERT_ACTION_COMPLETE: 'hertActionComplete'
};
class CharacterView extends LSprite {
    constructor(option) {
        super();
        let { id, level, belong, index } = option;
        this.id = id;
        this.level = level;
        this.belong = belong;
        this.index = index;
        this._init();
    }
    _init() {
        this.model = new CharacterModel(this.id, this.level);
        this.step = this.stepX = 8;
        this.stepY = 6;
        this.to = new LPoint(0, 0);
        this.layer = new LSprite();
        //this.layer.x = -16;
        //this.layer.y = -40;
        this.addChild(this.layer);

        this.hpLayer = new LSprite();
        this.hpLayer.x = (this.model.width * 32 - 64) * 0.5;
        this.hpLayer.y = this.model.height * 24 - 10;
        this.hpLayer.graphics.drawRect(1, '#000000', [0, 0, 64, 5], true, '#008800');
        this.hpLayer.graphics.drawRect(1, '#000000', [0, 5, 64, 5], true, '#FF0000');
        this.addChild(this.hpLayer);

        //this.addShape(LShape.RECT, [0, 0, BattleCharacterSize.width, BattleCharacterSize.height]);
        this.layer.addEventListener(LEvent.ENTER_FRAME, this._onframe, this);
        this._addAnimation();
        this.setActionDirection(CharacterAction.STAND, this.belong ? CharacterDirection.UP : CharacterDirection.DOWN);
    }
    setActionDirection(action, direction) {
        if (this.action === action && this.direction === direction) {
            return;
        }
        this.anime._send_complete = false;
        let label = action + '-' + direction;
        this.anime.gotoAndPlay(label);
        
        this.action = action;
        this.direction = direction;
    }
    changeAction(action) {
        this.setActionDirection(action, this.direction);
    }
    changeDirection(direction) {
        this.setActionDirection(this.action, direction);
    }
    setMoveDirection(x, y) {
        let direction = DirectionList[x + ',' + y];
        this.setActionDirection(CharacterAction.MOVE, direction);
    }
    setCoordinate(x, y) {
        this.x = this.to.x = x;
        this.y = this.to.y = y;
    }
    setRoad(list) {
        this.roads = list;
        if (this.to.x === this.x && this.to.y === this.y) {
            this._setTo();
        }
    }
    _setTo() {
        let road = this.roads.shift();
        this.to.x = road.x * this.w;
        this.to.y = road.y * this.h;	
    }
    _getValue(v1, v2) {
        if (v1 === v2) return 0;
        return v1 < v2 ? 1 : -1;
    }
    _onframe(event) {
        if (!this.to || (this.x === this.to.x && this.y === this.to.y)) {
            return;
        }
        if (this.x !== this.to.x) {
            this.step = this.stepX;
        } else {
            this.step = this.stepY;
        }
        let mx = this._getValue(this.x, this.to.x), my = this._getValue(this.y, this.to.y);
        this.x += this.step * mx;
        this.y += this.step * my * this.h / this.w;
        let cx = this._getValue(this.x, this.to.x), cy = this._getValue(this.y, this.to.y);
        if (mx !== cx || my !== cy) {
            if (this.roads.length === 0) {
                this.x = this.to.x;
                this.y = this.to.y;
                this.changeAction(CharacterAction.STAND);
                this.dispatchEvent(CharacterActionEvent.MOVE_COMPLETE);
                return;
            }
            let next = this.roads[0];
            let nx = this._getValue(this.to.x, next.x), ny = this._getValue(self.to.y, next.y);
            if (mx !== nx || my !== ny) {
                this.x = this.to.x;
                this.y = this.to.y;
            }
            if (this.roads.length > 0) {
                this._setTo();
            }
            
        }
        this.setMoveDirection(mx, my);
    }
    _loadImage() {
        let loader = new LLoader();
        loader.addEventListener(LEvent.COMPLETE, this._loadImageComplete, this);
        loader.load(`./resources/images/${this.id}.png`, LLoader.TYPE_BITMAPDATE);
    }
    _loadImageComplete(event) {
        let bitmapData = new LBitmapData(event.target);
        let height = bitmapData.height;
        console.log('height=', height, this.model.width, (this.model.width * 32 - height) * 0.5);
        let oldBitmapData = this.anime.bitmap.bitmapData;
        bitmapData.setProperties(height * oldBitmapData.x / oldBitmapData.height >>> 0, 0, height, height);
        this.anime.bitmap.bitmapData = bitmapData;
        this.anime.x = (this.model.width * 32 - height) * 0.5;
        this.anime.y = this.model.y;
        //this.anime.bitmap.bitmapData.setCoordinate(oldBitmapData.x, oldBitmapData.y);
        this.anime.setList(CharacterView._getAnimationData(height * 28, height));
        //this.layer.x = (32 - height) * 0.5 + ((this.model.width + 1) % 2) * 16;
        //this.layer.x = ((this.model.width % 2) * 32 - height) * 0.5;
        //this.layer.y = 24 - height;// this.model.height;
        //this.layer.y = -40;
        this.addShape(LShape.RECT, [0, 0, this.model.width * 32, this.model.height * 24]);
    }
    _addAnimation() {
        let bitmapData = new LBitmapData(Common.datalist[DEFAULT_CHARACTER_IMG], 0, 0, BattleCharacterSize.width, BattleCharacterSize.height);
        
        this.anime = new LAnimationTimeline(bitmapData, CharacterView._getAnimationData());
        this.anime.speed = SPEED;
        this.layer.addChild(this.anime);
        CharacterView._setAnimationLabel(this.anime);
        this.anime.setFrameSpeedAt(13, 0, 2);
        
        this.anime.addEventListener(LEvent.COMPLETE, this._actionComplete);
        for (let key in CharacterDirection) {
            this.anime.addFrameScript(`${CharacterAction.ATTACK_START}-${CharacterDirection[key]}`, this._attackToHert, []);
        }
        
        this._loadImage();
    }
    _actionComplete() {

    }
    _attackToHert() {
        this.dispatchEvent(CharacterActionEvent.ATTACK_ACTION_COMPLETE);
    }
}
CharacterView._getAnimationData = function(width = 1792, height = 64) {
    // 1792 x 64
    let list = LGlobal.divideCoordinate(width, height, 1, 28);
    let data = [
        [list[0][0], list[0][1], list[0][2], list[0][3], list[0][3]], //ATTACK 0
        [list[0][4], list[0][5], list[0][6], list[0][7], list[0][7]], //ATTACK 1
        [list[0][8], list[0][9], list[0][10], list[0][11], list[0][11]], //ATTACK 2
        [list[0][12], list[0][13]], //MOVE 3
        [list[0][14], list[0][15]], //MOVE 4
        [list[0][16], list[0][17]], //MOVE 5
        [list[0][18]], //STAND 6
        [list[0][19]], //STAND 7
        [list[0][20]], //STAND 8
        [list[0][21], list[0][22]], //PANT 9
        [list[0][23], list[0][23]], //BLOCK 10
        [list[0][24], list[0][24]], //BLOCK 11
        [list[0][25], list[0][25]], //BLOCK 12
        [list[0][26], list[0][26]], //HERT 13
        [list[0][27]], //WAKE 14
        [list[0][18], list[0][23], list[0][18], list[0][23], list[0][27], list[0][27], list[0][27]], //LEVELUP 15
        [list[0][19], list[0][24], list[0][19], list[0][24], list[0][27], list[0][27], list[0][27]], //LEVELUP 16
        [list[0][20], list[0][25], list[0][20], list[0][25], list[0][27], list[0][27], list[0][27]], //LEVELUP 17
        [list[0][0]], //MAGIC_ATTACK 18
        [list[0][4]], //MAGIC_ATTACK 19
        [list[0][8]], //MAGIC_ATTACK 20
    ];
    return data;
};
CharacterView._setAnimationLabel = function(anime) {
    //ATTACK
    anime.setLabel(`${CharacterAction.ATTACK}-${CharacterDirection.DOWN}`, 0, 0, 1, false);
    anime.setLabel(`${CharacterAction.ATTACK}-${CharacterDirection.UP}`, 1, 0, 1, false);
    anime.setLabel(`${CharacterAction.ATTACK}-${CharacterDirection.LEFT}`, 2, 0, 1, false);
    anime.setLabel(`${CharacterAction.ATTACK}-${CharacterDirection.RIGHT}`, 2, 0, 1, true);
    
    anime.setLabel(`${CharacterAction.ATTACK_START}-${CharacterDirection.DOWN}`, 0, 3, 1, false);
    anime.setLabel(`${CharacterAction.ATTACK_START}-${CharacterDirection.UP}`, 1, 3, 1, false);
    anime.setLabel(`${CharacterAction.ATTACK_START}-${CharacterDirection.LEFT}`, 2, 3, 1, false);
    anime.setLabel(`${CharacterAction.ATTACK_START}-${CharacterDirection.RIGHT}`, 2, 3, 1, true);
    //MOVE
    anime.setLabel(`${CharacterAction.MOVE}-${CharacterDirection.DOWN}`, 3, 0, 1, false);
    anime.setLabel(`${CharacterAction.MOVE}-${CharacterDirection.UP}`, 4, 0, 1, false);
    anime.setLabel(`${CharacterAction.MOVE}-${CharacterDirection.LEFT}`, 5, 0, 1, false);
    anime.setLabel(`${CharacterAction.MOVE}-${CharacterDirection.RIGHT}`, 5, 0, 1, true);
    //STAND
    anime.setLabel(`${CharacterAction.STAND}-${CharacterDirection.DOWN}`, 6, 0, 1, false);
    anime.setLabel(`${CharacterAction.STAND}-${CharacterDirection.UP}`, 7, 0, 1, false);
    anime.setLabel(`${CharacterAction.STAND}-${CharacterDirection.LEFT}`, 8, 0, 1, false);
    anime.setLabel(`${CharacterAction.STAND}-${CharacterDirection.RIGHT}`, 8, 0, 1, true);
    //PANT
    anime.setLabel(`${CharacterAction.PANT}-${CharacterDirection.DOWN}`, 9, 0, 1, false);
    anime.setLabel(`${CharacterAction.PANT}-${CharacterDirection.UP}`, 9, 0, 1, false);
    anime.setLabel(`${CharacterAction.PANT}-${CharacterDirection.LEFT}`, 9, 0, 1, false);
    anime.setLabel(`${CharacterAction.PANT}-${CharacterDirection.RIGHT}`, 9, 0, 1, false);
    //BLOCK
    anime.setLabel(`${CharacterAction.BLOCK}-${CharacterDirection.DOWN}`, 10, 0, 1, false);
    anime.setLabel(`${CharacterAction.BLOCK}-${CharacterDirection.UP}`, 11, 0, 1, false);
    anime.setLabel(`${CharacterAction.BLOCK}-${CharacterDirection.LEFT}`, 12, 0, 1, false);
    anime.setLabel(`${CharacterAction.BLOCK}-${CharacterDirection.RIGHT}`, 12, 0, 1, true);
    //HERT
    anime.setLabel(`${CharacterAction.HERT}-${CharacterDirection.DOWN}`, 13, 0, 1, false);
    anime.setLabel(`${CharacterAction.HERT}-${CharacterDirection.UP}`, 13, 0, 1, false);
    anime.setLabel(`${CharacterAction.HERT}-${CharacterDirection.LEFT}`, 13, 0, 1, false);
    anime.setLabel(`${CharacterAction.HERT}-${CharacterDirection.RIGHT}`, 13, 0, 1, false);
    //LEVELUP
    anime.setLabel(`${CharacterAction.WAKE}-${CharacterDirection.DOWN}`, 14, 0, 1, false);
    anime.setLabel(`${CharacterAction.WAKE}-${CharacterDirection.UP}`, 14, 0, 1, false);
    anime.setLabel(`${CharacterAction.WAKE}-${CharacterDirection.LEFT}`, 14, 0, 1, false);
    anime.setLabel(`${CharacterAction.WAKE}-${CharacterDirection.RIGHT}`, 14, 0, 1, false);
    //LEVELUP
    anime.setLabel(`${CharacterAction.LEVELUP}-${CharacterDirection.DOWN}`, 15, 0, 1, false);
    anime.setLabel(`${CharacterAction.LEVELUP}-${CharacterDirection.UP}`, 16, 0, 1, false);
    anime.setLabel(`${CharacterAction.LEVELUP}-${CharacterDirection.LEFT}`, 17, 0, 1, false);
    anime.setLabel(`${CharacterAction.LEVELUP}-${CharacterDirection.RIGHT}`, 17, 0, 1, true);
    //MAGIC_ATTACK
    anime.setLabel(`${CharacterAction.MAGIC_ATTACK}-${CharacterDirection.DOWN}`, 18, 0, 1, false);
    anime.setLabel(`${CharacterAction.MAGIC_ATTACK}-${CharacterDirection.UP}`, 19, 0, 1, false);
    anime.setLabel(`${CharacterAction.MAGIC_ATTACK}-${CharacterDirection.LEFT}`, 20, 0, 1, false);
    anime.setLabel(`${CharacterAction.MAGIC_ATTACK}-${CharacterDirection.RIGHT}`, 20, 0, 1, true);
};
export default CharacterView;