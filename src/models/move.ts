import { Car, checkForward } from "./car";
import { ConflictZone } from "./confict_zone";
import { Road } from "./road";

export default abstract class Move {
	abstract perform: (car: Car) => void;
}

export class MoveRight extends Move {
	perform = (car: Car) => {
		car.started = true;
		if (car.road && car.idOnRoad && car.idOnRoad > 1) {
			// The car is still on the road
			car.idOnRoad--;
			return;
		}
		const target = checkForward(car);
		if (target) {
			if (target instanceof Road) {
				return; // Invalid move
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
}
