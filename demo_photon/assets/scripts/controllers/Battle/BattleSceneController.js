import PrefabContainer from '../../../plugin/mvc/prefabs/PrefabContainer';
import SceneController from '../../../plugin/mvc/controllers/SceneController';
import ArrowListView from '../../views/ArrowListView';
import LSprite from '../../../plugin/lufylegend/display/LSprite';
import CharacterArrowListView from '../../views/CharacterArrowListView';
import EventManager from '../../managers/EventManager';
import LTextField from '../../../plugin/lufylegend/text/LTextField';
import LTweenLite from '../../../plugin/lufylegend/transitions/LTweenLite';
import MasterClient from '../../utils/MasterClient';
class BattleSceneController extends SceneController {
    onLoad(request) {
        super.onLoad(request);
        console.error('BattleSceneController', request);
        let enemyPlayer = request.enemyPlayer;
        this.dispatcher.characters = request.characters;
        this.dispatcher.enemys = enemyPlayer.getData().characters;
        this.dispatcher.playerHp = 200;
        this.dispatcher.enemyHp = 200;
        this.dispatcher.boss = { name: '老虎', icon: 'chara-5', hp: 200, skills: [
            { num: 2, value: 2 },
            { num: 3, value: 3 },
            { num: 4, value: 4 },
            { num: 5, value: 5 }
        ] };
    }
    onLoadEnd() {
        super.onLoadEnd();

        this.boss = this.getChildByName('boss');
        this.boss.visible = false;

        let inputViewContainer = this.getChildByName('inputViewContainer');
        this.inputView = new ArrowListView([], 72);
        this.inputView.y = (inputViewContainer.getHeight() - 72) * 0.5;
        inputViewContainer.addChild(this.inputView);
        
        let charactersInputViewContainer = this.getChildByName('charactersInputViewContainer');
        this.charactersInputViewContainer = charactersInputViewContainer;
        this.charactersInputView = new LSprite();
        charactersInputViewContainer.addChild(this.charactersInputView);

        this.charactersInit();

        this.playerHpBar = this.getChildByName('PlayerHpBar');
        this.playerHp = this.dispatcher.playerHp;
        this.enemyHpBar = this.getChildByName('EnemyHpBar');
        this.enemyHp = this.dispatcher.enemyHp;
        EventManager.addEventListener('player:hert', (event) => {
            this.playerHert(event);
        });
        EventManager.addEventListener('enemy:hert', (event) => {
            this.enemyHert(event);
        });
        EventManager.addEventListener('player:attack', (event) => {
            this.playerAttack(event);
        });
        /*EventManager.addEventListener('enemy:attack', (event) => {
            this.enemyAttack(event);
        });*/
        MasterClient.addEventListener('enemy:attack', (event) => {
            this.enemyAttack(event);
        });
    }
    playerAttack(event) {
        let index = event.index;
        let character = this.characterViews[index];
        character.attackEnemy(event.hert);
    }
    enemyAttack(event) {
        let index = event.index;
        let enemy = this.enemyViews[index];
        enemy.attackPlayer(event.hert);
    }
    playerHert(event) {
        this.playerHp -= event.hertValue;
        this.hertShow(event.hertValue, 350);
        if (this.playerHp > 0) {
            this.playerHpBar.resize((this.playerHp * 480 / this.dispatcher.playerHp) >> 0, 24);
        } else {
            this.playerHpBar.visible = false;
        }
    }
    enemyHert(event) {
        this.enemyHp -= event.hertValue;
        this.hertShow(event.hertValue, 100);
        if (this.enemyHp > 0) {
            this.enemyHpBar.resize((this.enemyHp * 480 / this.dispatcher.enemyHp) >> 0, 24);
        } else {
            this.enemyHpBar.visible = false;
        }
    }
    hertShow(value, y) {
        let minusText = new LTextField();
        minusText.x = 360;
        minusText.y = y;
        minusText.size = 30;
        minusText.color = '#FFFFFF';
        minusText.text = `-${value}`;
        this.addChild(minusText);
        LTweenLite.to(minusText, 0.2, { y: y - 10 }).to(minusText, 0.1, { y: y - 20, onComplete: function(event) {
            event.target.remove();
        } });
    }
    arrowClick(event, param) {
        this.inputView.add(param, 72);
        this.charactersInputView.childList.forEach((child) => {
            child.checkDraw(this.inputView);
        });
    }
    goClick() {
        let readyCharacters = this.charactersInputView.childList.filter((child) => {
            return child.isReady;
        });
        readyCharacters.forEach((character) => {
            character.attack(this.charactersInputView.childList.findIndex((child) => {
                return child.y === character.y;
            }));
            //character.attack(this.boss);
        });
        this.inputView.clear();
        this.charactersInputView.childList.forEach((child) => {
            child.checkDraw(this.inputView);
        });
    }
    charactersInit() {
        let charactersLayer = this.getChildByName('characters');
        if (charactersLayer.numChildren === 0) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    this.charactersInit();
                    resolve();
                }, 100);
            });
        }
        let characterViews = charactersLayer.childList;
        this.charactersInputView.y = (this.charactersInputViewContainer.getHeight() - 72 * 4) * 0.5;
        this.characterViews = characterViews;
        let enemysLayer = this.getChildByName('enemys');
        this.enemyViews = enemysLayer.childList;
        for (let i = 0;i < this.characterViews.length;i++) {
            let characterArrowListView = new CharacterArrowListView([], 72, this.characterViews[i]);
            characterArrowListView.y = i * 72;
            this.charactersInputView.addChild(characterArrowListView);
        }
        return Promise.resolve();
    }
}
PrefabContainer.set('BattleSceneController', BattleSceneController);
export default BattleSceneController;