import { useCallback, useRef, useState } from "react";
import { Car } from "../models/car";
import { Road } from "../models/road";

function useCars() {
	const [demoCar, setDemoCar] = useState(new Car(0));
	const [cars, setCars] = useState<Car[]>([]);
	const nextCarId = useRef(2);

	const moveCar = (carId: number, road: Road) => {
		const car = cars.find((car) => car.id == carId);
		if (car) {
			// Aleady exists
			car.setInitialRoad(road);
			setCars([...cars]);
		} else {
			// New car
			const car = new Car(nextCarId.current, demoCar.color);
			nextCarId.current += 1;
			car.setInitialRoad(road);
			cars.push(car);
			setCars([...cars]);
			demoCar.setRandomColor(demoCar.color);
			setDemoCar({ ...demoCar });
		}
	};

	return { cars, demoCar, moveCar };
}

export default useCars;
