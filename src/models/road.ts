import { Direction } from "../utils/dir_utils";
import { Car } from "./car";

export class Road {
	constructor(id: number, dir: Direction) {
		this.id = id;
		this.dir = dir;
	}

	public id: number;
	public dir: Direction;
	public initialCars: Car[] = [];
	public cars: Car[] = [];
	public isDest: boolean = false;

	public addCar = (car: Car, initial: boolean = false) => {
		if (initial) {
			this.cars.push(car);
			this.initialCars.push(car);
		} else {
			for (const car of this.cars) {
				car.idOnRoad++;
			}
			this.cars.unshift(car);
		}
	};

	public removeCar = (car: Car, initial: boolean = false) => {
		this.cars = this.cars.filter((e) => e.id != car.id);
		if (initial) {
			for (const c of this.cars) {
				if (c.idOnRoad && car.idOnRoad && c.idOnRoad > car.idOnRoad) {
					c.idOnRoad--;
					c.initialIdOnRoad--;
				}
			}
			this.initialCars = this.initialCars.filter((e) => e.id != car.id);
		}
	};

	get numCars() {
		return this.cars.length;
	}
}
