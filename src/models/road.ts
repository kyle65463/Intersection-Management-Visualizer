import { Direction } from "../utils/dir_utils";
import { Car } from "./car";

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
		for (const c of this.cars) {
			if (c.idOnRoad && car.idOnRoad && c.idOnRoad > car.idOnRoad) {
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
