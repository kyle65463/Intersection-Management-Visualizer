export type Direction = "left" | "right" | "top" | "bot";

export const dirRoation = {
	left: 0,
	right: 180,
	top: -90,
	bot: 90,
};

export function oppositeDir(dir: Direction): Direction {
	if (dir === "right") return "left";
	if (dir === "left") return "right";
	if (dir === "top") return "bot";
	if (dir === "bot") return "top";
	return "left";
}

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
