import LSprite from '../plugin/lufylegend/display/LSprite';
import LBitmapData from '../plugin/lufylegend/display/LBitmapData';
import LBitmap from '../plugin/lufylegend/display/LBitmap';
class Bird extends LSprite{
    constructor(img){
        super();
        this.init(img);
    }
    init(img){
        let bitmapData = new LBitmapData(img);
        let bitmap = new LBitmap(bitmapData);
        this.addChild(bitmap);
    }
}
export default Bird;