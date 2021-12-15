import { ConflictZone } from "./confict_zone";
import { Direction, Road } from "./road";

export class Car {
	constructor(id: number) {
		this.id = id;
		this.roadId = 0;
	}

	public id: number;
	public roadId: number;
	public road?: Road;
	public zone?: ConflictZone;
}
