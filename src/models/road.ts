export type Direction = "left" | "right" | "top" | "bot";

export class Road {
	constructor(id: number, dir: Direction) {
		this.id = id;
		this.dir = dir;
	}

	public id: number;
	public dir: Direction;
	static numAllRoads = {
		left: 1,
		right: 1,
		top: 1,
		bot: 1,
	};

	get numRoads() {
		return Road.numAllRoads[this.dir];
	}
}
