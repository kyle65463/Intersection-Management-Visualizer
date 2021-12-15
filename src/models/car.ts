import { ConflictZone } from "./confict_zone";
import { Direction, dirRoation, oppositeDir, Road } from "./road";

function checkForward(car: Car): Road | ConflictZone | undefined {
	const { road, zone, dir } = car;
	if (zone) {
		if (dir === "right") {
			console.log("go right");
			if (zone.col == ConflictZone.numCols - 1) {
				console.log("last one");
				const id = ~~((ConflictZone.numRows - Road.numAllRoads.right) / 2);
				return new Road(zone.row - id, "right");
			} else {
				return new ConflictZone(zone.col + 1, zone.row);
			}
		} else if (dir === "left") {
			if (zone.col == 0) {
				const id = ~~((ConflictZone.numRows - Road.numAllRoads.left) / 2);
				return new Road(zone.row - id, "left");
			} else {
				return new ConflictZone(zone.col - 1, zone.row);
			}
		} else if (dir === "top") {
			if (zone.row == 0) {
				const id = ~~((ConflictZone.numCols - Road.numAllRoads.top) / 2);
				return new Road(zone.col - id, "top");
			} else {
				return new ConflictZone(zone.col, zone.row - 1);
			}
		} else {
			if (zone.row == ConflictZone.numRows - 1) {
				const id = ~~((ConflictZone.numCols - Road.numAllRoads.bot) / 2);
				return new Road(zone.col - id, "bot");
			} else {
				return new ConflictZone(zone.col, zone.row + 1);
			}
		}
	} else if (road) {
		if (road.dir === "right") {
			const offset = ~~((ConflictZone.numRows - Road.numAllRoads.right) / 2);
			return new ConflictZone(ConflictZone.numCols - 1, offset + road.id);
		} else if (road.dir === "left") {
			const offset = ~~((ConflictZone.numRows - Road.numAllRoads.left) / 2);
			return new ConflictZone(0, offset + road.id);
		} else if (road.dir === "top") {
			const offset = ~~((ConflictZone.numCols - Road.numAllRoads.top) / 2);
			return new ConflictZone(offset + road.id, 0);
		} else {
			const offset = ~~((ConflictZone.numCols - Road.numAllRoads.bot) / 2);
			return new ConflictZone(offset + road.id, ConflictZone.numRows - 1);
		}
	}
}

export const goStraight = (car: Car) => {
	car.started = true;
	const target = checkForward(car);
	if (target) {
		if (target instanceof Road) {
			car.road = target;
			car.zone = undefined;
		}
		if (target instanceof ConflictZone) {
			car.zone = target;
			car.road = undefined;
		}
	}
	if (car.turning === "clockwise") {
		car.rotation += 45;
	}
	if (car.turning === "anti-clockwise") {
		car.rotation -= 45;
	}
	car.turning = "none";
};

export const goLeft = (car: Car) => {
	car.started = true;
	const target = checkForward(car);
	if (target) {
		if (target instanceof Road) {
			car.road = target;
			car.zone = undefined;
		}
		if (target instanceof ConflictZone) {
			car.zone = target;
			car.road = undefined;
		}
	}
	if (car.dir === "right") {
		car.dir = "top";
	} else if (car.dir === "left") {
		car.dir = "bot";
	} else if (car.dir === "top") {
		car.dir = "left";
	} else {
		car.dir = "right";
	}
	if (car.turning === "clockwise") {
		car.rotation += 45;
	}
	if (car.turning === "anti-clockwise") {
		car.rotation -= 45;
	}
	car.rotation -= 45;
	car.turning = "anti-clockwise";
};

export const goRight = (car: Car) => {
	car.started = true;
	const target = checkForward(car);
	if (target) {
		if (target instanceof Road) {
			car.road = target;
			car.zone = undefined;
		}
		if (target instanceof ConflictZone) {
			car.zone = target;
			car.road = undefined;
		}
	}
	if (car.dir === "right") {
		car.dir = "bot";
	} else if (car.dir === "left") {
		car.dir = "top";
	} else if (car.dir === "top") {
		car.dir = "right";
	} else {
		car.dir = "left";
	}
	if (car.turning === "clockwise") {
		car.rotation += 45;
	}
	if (car.turning === "anti-clockwise") {
		car.rotation -= 45;
	}
	car.rotation += 45;
	car.turning = "clockwise";
};

type Turning = "clockwise" | "anti-clockwise" | "none";

export class Car {
	constructor(id: number) {
		this.id = id;
	}

	public setInitialRoad = (road: Road) => {
		this.rotation = dirRoation[road.dir];
		this.dir = oppositeDir(road.dir);
		this.road = road;
	};

	public id: number;
	public dir: Direction = "right";
	public rotation: number = 0;
	public road?: Road;
	public zone?: ConflictZone;
	public started = false;
	public turning: Turning = "none";
}
