import Floor from './Floor';

let StageData = {
    getFloor: function(index) {
        let floor;
        floor = new Floor(index);
        return floor;
    }
};
export default StageData;
