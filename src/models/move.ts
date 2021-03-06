import { Intersection } from "../hooks/useIntersection";
import { relativeDir } from "../utils/dir_utils";
import { getZoneFrontOfCar } from "../utils/zone_utils";
import { Car } from "./car";
import { Road } from "./road";

export default abstract class Move {
	public perform(car: Car, intersection: Intersection) {
		car.started = true;
		if (car.curZone instanceof Road && car.idOnRoad > 1) {
			car.idOnRoad--;
			return;
		}
		if (car.curZone instanceof Road) {
			car.curZone.removeCar(car);
		}
		const target = getZoneFrontOfCar(car, intersection);
		if (!target) return; // Action not valid
		if (target instanceof Road) {
			car.isEnd = true;
			target.addCar(car);
		}
		car.curZone = target;
		if (car.turning === "clockwise") car.rotation += 45;
		if (car.turning === "anti-clockwise") car.rotation -= 45;
		car.turning = "none";
	}

	static generateRandomMove(): Move {
		const p = Math.random();
		if (p > 0.3) {
			return new MoveForward();
		} else if (p > 0.15) {
			return new MoveLeft();
		} else {
			return new MoveRight();
		}
	}

	static from(action: string): Move {
		if (action === "right") {
			return new MoveRight();
		}
		if (action === "left") {
			return new MoveLeft();
		}
		if (action === "foward") {
			return new MoveForward();
		}
		return new Stop();
	}
}

export class Stop extends Move {
	public perform(car: Car, intersection: Intersection) {}
}

export class MoveForward extends Move {
	public perform(car: Car, intersection: Intersection) {
		super.perform(car, intersection);
	}
}

export class MoveRight extends Move {
	public perform(car: Car, intersection: Intersection) {
		super.perform(car, intersection);
		if (!(car.curZone instanceof Road)) {
			car.dir = relativeDir(car.dir, "clockwise");
			car.rotation += 45;
			car.turning = "clockwise";
		}
	}
}

export class MoveLeft extends Move {
	public perform(car: Car, intersection: Intersection) {
		super.perform(car, intersection);
		if (!(car.curZone instanceof Road)) {
			car.dir = relativeDir(car.dir, "anti-clockwise");
			car.rotation -= 45;
			car.turning = "anti-clockwise";
		}
	}
}
