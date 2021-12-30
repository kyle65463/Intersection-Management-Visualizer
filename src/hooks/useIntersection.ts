import { useCallback, useRef, useState } from "react";
import { Car } from "../models/car";
import { ConflictZone } from "../models/confict_zone";
import { Road } from "../models/road";
import { maxRoadNum } from "../utils/constants";
import { Direction, dirRoation, dirs, relativeDir } from "../utils/dir_utils";

interface RoadCollection {
	dir: Direction;
	roads: Road[];
}

export interface Intersection {
	demoCar: Car;
	cars: Car[];
	roadCollections: RoadCollection[];
	zones: ConflictZone[];
	zonesSize: { numCol: number; numRow: number };
	selectingDestCar?: Car;
	previewingDestCar?: Car;
}

function getRandomInt(min: number, max: number): number {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

function getRandomInitialRoad({ roadCollections }: Intersection): Road | undefined {
	let roads = [
		...roadCollections[0].roads,
		...roadCollections[1].roads,
		...roadCollections[2].roads,
		...roadCollections[3].roads,
	];
	roads = roads.filter((road) => !road.isDest && road.numCars < 4);
	return roads[Math.floor(Math.random() * roads.length)];
}

function getRandomDestRoad({ roadCollections }: Intersection, initialRoad: Road): Road | undefined {
	let roads = [
		...roadCollections[0].roads,
		...roadCollections[1].roads,
		...roadCollections[2].roads,
		...roadCollections[3].roads,
	];
	roads = roads.filter((road) => road.numCars == 0 && road.dir != initialRoad.dir);
	return roads[Math.floor(Math.random() * roads.length)];
}

const initialIntersection = (numCol: number, numRow: number): Intersection => {
	const intersection: Intersection = {
		demoCar: new Car(0),
		cars: [],
		roadCollections: dirs.map((dir) => ({
			dir,
			roads: Array.from(Array(dir == "top" || dir == "bot" ? numCol : numRow), (_, i) => new Road(i, dir)),
		})),
		zones: [],
		zonesSize: { numCol, numRow },
		selectingDestCar: undefined,
	};
	for (let i = 0; i < numCol; i++) {
		for (let j = 0; j < numRow; j++) {
			intersection.zones.push(new ConflictZone(i, j));
		}
	}
	return intersection;
};

function useIntersection() {
	const [intersection, setIntersection] = useState<Intersection>(initialIntersection(3, 3));
	const nextCarId = useRef(2);

	const updateZones = useCallback((intersection: Intersection) => {
		const { roadCollections, zones, zonesSize } = intersection;

		// Find new zone size
		zonesSize.numCol = 0;
		zonesSize.numRow = 0;
		roadCollections.forEach((collection) => {
			if (collection.dir === "left" || collection.dir === "right") {
				zonesSize.numRow = Math.max(zonesSize.numRow, collection.roads.length);
			} else {
				zonesSize.numCol = Math.max(zonesSize.numCol, collection.roads.length);
			}
		});

		// Update zones
		zones.splice(0, zones.length);
		for (let i = 0; i < zonesSize.numCol; i++) {
			for (let j = 0; j < zonesSize.numRow; j++) {
				zones.push(new ConflictZone(i, j));
			}
		}
	}, []);

	const addRoad = useCallback((road: Road) => {
		setIntersection((intersection) => {
			const { roadCollections, cars } = intersection;
			const roadsId = roadCollections.findIndex((roads) => roads.dir === road.dir);
			if (!roadCollections[roadsId].roads.find((e) => e.id == road.id)) {
				if (roadCollections[roadsId].roads.length < maxRoadNum) roadCollections[roadsId].roads.push(road);
			}
			updateZones(intersection);
			cars.forEach((car) => {
				if (car.destRoad) car.setDestRoad(car.destRoad, intersection);
			});
			return { ...intersection };
		});
	}, []);

	const newCar = useCallback((road: Road) => {
		setIntersection((intersection) => {
			const { cars, demoCar } = intersection;
			const car = new Car(nextCarId.current, demoCar.color);
			nextCarId.current += 1;
			road.addCar(car, true);
			car.setInitialRoad(road);
			cars.push(car);

			// Regenerate a color for demo car
			demoCar.setRandomColor(demoCar.color);
			return { ...intersection, selectingDestCar: car };
		});
	}, []);

	const moveCar = (carId: number, road: Road) => {
		if (carId != 0) {
			setIntersection((intersection) => {
				const { cars } = intersection;
				const car = cars.find((car) => car.id == carId);
				if (car) {
					car.initialRoad.removeCar(car, true);
					road.addCar(car, true);
					car.setInitialRoad(road);
				}
				return { ...intersection, selectingDestCar: car };
			});
			// Aleady exists
		} else {
			// New car
			newCar(road);
		}
	};

	const setCarDest = useCallback((road: Road) => {
		setIntersection((intersection) => {
			const { selectingDestCar } = intersection;
			if (selectingDestCar) selectingDestCar.setDestRoad(road, intersection);
			road.isDest = true;
			return { ...intersection, selectingDestCar: undefined, previewingDestCar: selectingDestCar };
		});
	}, []);

	const setCars = useCallback((cars: Car[]) => {
		setIntersection((intersection) => {
			intersection.cars = cars;
			return { ...intersection };
		});
	}, []);

	const reset = useCallback(() => {
		setIntersection((intersection) => {
			const { roadCollections, cars } = intersection;
			for (const col of roadCollections) {
				for (const road of col.roads) {
					road.cars = [...road.initialCars];
				}
			}
			for (const car of cars) {
				car.isEnd = false;
				car.started = false;
				car.curZone = car.initialRoad;
				car.rotation = dirRoation[car.initialRoad.dir];
				car.dir = relativeDir(car.initialRoad.dir, "opposite");
				car.idOnRoad = car.initialIdOnRoad;
			}
			intersection.cars = cars;
			return { ...intersection, selectingDestCar: undefined, previewingDestCar: undefined };
		});
	}, []);

	const setPreviewingCar = useCallback((car?: Car) => {
		setIntersection((intersection) => {
			return { ...intersection, previewingDestCar: car };
		});
	}, []);

	const setSelectingDestCar = useCallback((car?: Car) => {
		setIntersection((intersection) => {
			return { ...intersection, selectingDestCar: car };
		});
	}, []);

	const randomIntersection = useCallback(() => {
		const numCol = getRandomInt(3, 9);
		const numRow = getRandomInt(3, 9);
		const newIntersection = initialIntersection(numCol, numRow);
		const numRoads = (numCol + numRow) * 2;
		const numCar = getRandomInt(numRoads / 2, numRoads * 1.6);
		const { cars, demoCar } = newIntersection;
		for (let i = 0; i < numCar; i++) {
			const car = new Car(nextCarId.current, demoCar.color);
			nextCarId.current += 1;
			const initialRoad = getRandomInitialRoad(newIntersection);
			if (initialRoad) {
				const destRoad = getRandomDestRoad(newIntersection, initialRoad);
				if (destRoad) {
					initialRoad.addCar(car, true);
					car.setInitialRoad(initialRoad);
					car.setDestRoad(destRoad, intersection);
					destRoad.isDest = true;
					cars.push(car);
				}
			}

			// Regenerate a color for demo car
			demoCar.setRandomColor(demoCar.color);
		}
		setIntersection(newIntersection);
	}, []);

	return {
		intersection,
		moveCar,
		addRoad,
		setCars,
		setCarDest,
		setPreviewingCar,
		setSelectingDestCar,
		randomIntersection,
		reset,
		...intersection,
	};
}

export default useIntersection;
