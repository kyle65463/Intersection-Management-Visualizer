export type Direction = "left" | "right" | "top" | "bot";

export class Road {
	constructor(id: number, dir: Direction) {
		this.id = id;
        this.dir = dir;
	}

	public id: number;
	public dir: Direction;
}
