export type RoadDirection = "left" | "right" | "top" | "bot";

export class Road {
	constructor(id: number, dir: RoadDirection) {
		this.id = id;
        this.dir = dir;
	}

	public id: number;
	public dir: RoadDirection;
}
