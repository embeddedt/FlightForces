export default class Box2D {
    constructor(public xmin: number, public ymin: number, public xmax: number, public ymax: number) {

    }
    public merge(other_box: Box2D): Box2D {
        return new Box2D(this.xmin === undefined ? other_box.xmin : Math.min(this.xmin, other_box.xmin), this.ymin === undefined ? other_box.ymin : Math.min(this.ymin, other_box.ymin), this.xmax === undefined ? other_box.xmax : Math.max(this.xmax, other_box.xmax), this.ymax === undefined ? other_box.ymax : Math.max(this.ymax, other_box.ymax));
    }
}