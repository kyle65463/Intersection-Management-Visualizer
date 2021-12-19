import { useCallback, useRef, useState } from "react";
import { Car } from "../models/car";
import { Road } from "../models/road";

function useCars(updateRoad: (road: Road) => void) {
	const [demoCar, setDemoCar] = useState(new Car(0));
	const [cars, setCars] = useState<Car[]>([]);
	const nextCarId = useRef(2);

	const moveCar = (carId: number, road: Road) => {
		const car = cars.find((car) => car.id == carId);
		if (car) {
			// Aleady exists
			if (car.road) {
				car.road.removeCar(car);
				updateRoad(car.road);
			}
			road.addCar(car);
			car.setInitialRoad(road);
			updateRoad(road);
			setCars([...cars]);
		} else {
			// New car
			const car = new Car(nextCarId.current, demoCar.color);
			nextCarId.current += 1;

			road.addCar(car);
			car.setInitialRoad(road);
			updateRoad(road);

			cars.push(car);
			setCars([...cars]);

			// Regenerate a color for demo car
			demoCar.setRandomColor(demoCar.color);
			setDemoCar({ ...demoCar });
		}
	};

	return { cars, demoCar, moveCar, setCars };
}

export default useCars;
