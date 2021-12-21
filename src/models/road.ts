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

	public addCar = (car: Car, rev: boolean = false) => {
		if (!rev) {
			this.cars.push(car);
		} else {
			for (const car of this.cars) {
				car.idOnRoad++;
			}
			this.cars.unshift(car);
		}
	};

	public removeCar = (car: Car, isShift: boolean = true) => {
		this.cars = this.cars.filter((e) => e.id != car.id);
		if (isShift) {
			for (const c of this.cars) {
				if (c.idOnRoad && car.idOnRoad && c.idOnRoad > car.idOnRoad) {
					c.idOnRoad--;
				}
			}
		}
	};

	get numCars() {
		return this.cars.length;
	}
}
