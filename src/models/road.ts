import { Car } from "./car";

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
	public cars: Car[] = [];

	public addCar = (car: Car) => {
		this.cars.push(car);
	};

	public removeCar = (car: Car) => {
		this.cars = this.cars.filter((e) => e.id != car.id);
		for(const c of this.cars) {
			if(c.idOnRoad && car.idOnRoad && c.idOnRoad > car.idOnRoad) {
				c.idOnRoad--;
			}
		}
	};

	static numAllRoads = {
		left: 1,
		right: 1,
		top: 1,
		bot: 1,
	};

	get numRoads() {
		return Road.numAllRoads[this.dir];
	}

	get numCars() {
		return this.cars.length;
	}
}
