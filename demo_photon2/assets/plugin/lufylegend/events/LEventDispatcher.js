import LObject from '../utils/LObject';
import { UNDEFINED } from '../utils/LConstant';
class LEventDispatcher extends LObject {
    constructor() {
        super();
        this._eventList = [];
    }

    addEventListener(type, listener, _this) {
        this._eventList.push({ listener: listener, type: type, _this: _this });
    }
    removeEventListener(type, listener) {
        let i, length;
        length = this._eventList.length;
        for (i = 0; i < length; i++) {
            if (!this._eventList[i]) {
                continue;
            }
            if (type === this._eventList[i].type && (!listener || this._eventList[i].listener === listener)) {
                this._eventList.splice(i, 1);
                return;
            }
        }
    }
    removeAllEventListener() {
        this._eventList = [];
    }
    dispatchEvent(event) {
        let length = this._eventList.length;
        let ctype = (typeof event === 'string') ? event : event.eventType;
        for (let i = 0; i < length; i++) {
            let child = this._eventList[i];
            if (!child) {
                continue;
            }
            if (ctype === this._eventList[i].type) {
                if (typeof event === 'string') {
                    child.listener.call(child._this ? child._this : this, {
                        currentTarget: this,
                        target: this,
                        eventType: ctype,
                        event_type: ctype
                    });
                } else {
                    if (!event.target) {
                        event.target = this;
                    }
                    if (!event.currentTarget) {
                        event.currentTarget = event.target;
                    }
                    event._ll_preventDefault = false;
                    child.listener.call(child._this ? child._this : this, event);
                    if (event._ll_preventDefault) {
                        return false;
                    }
                }
                return true;
            }
        }
        return false;
    }
    hasEventListener(type, listener) {
        for (let i = 0, length = this._eventList.length; i < length; i++) {
            if (!this._eventList[i]) {
                continue;
            }
            if (type === this._eventList[i].type) {
                if (typeof listener === UNDEFINED || listener === this._eventList[i].listener) {
                    return true;
                }
            }
        }
        return false;
    }
}
export default LEventDispatcher;