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
			car.ended = true;
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
			goStraight(car);
			return;
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
			goStraight(car);
			return;
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
type Color = "blue" | "red" | "green" | "yellow" | "amber" | "indigo" | "sky";

export function colorToStyle(color: Color) {
	switch (color) {
		case "blue":
			return "bg-blue-400";
		case "red":
			return "bg-red-400";
		case "green":
			return "bg-green-400";
		case "yellow":
			return "bg-yellow-400";
		case "amber":
			return "bg-amber-400";
		case "indigo":
			return "bg-indigo-400";
		case "sky":
			return "bg-sky-400";
	}
}

export class Car {
	constructor(id: number, color?: Color) {
		this.id = id;
		this.color = color ?? "blue";
	}

	public setInitialRoad = (road: Road) => {
		this.rotation = dirRoation[road.dir];
		this.dir = oppositeDir(road.dir);
		this.road = road;
	};

	public setRandomColor = (exclude?: Color) => {
		const colors: any = ["blue", "red", "green", "yellow", "amber", "indigo", "sky"];
		let rand = Math.floor(Math.random() * Object.keys(colors).length);
		let randColor: Color = colors[Object.keys(colors)[rand]];
		while (randColor == exclude) {
			rand = Math.floor(Math.random() * Object.keys(colors).length);
			randColor = colors[Object.keys(colors)[rand]];
		}
		this.color = randColor;
	};

	public id: number;
	public dir: Direction = "right";
	public rotation: number = 0;
	public road?: Road;
	public zone?: ConflictZone;
	public started = false;
	public turning: Turning = "none";
	public ended = false;
	public color: Color = "blue";
}
