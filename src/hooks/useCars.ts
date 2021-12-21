import { useCallback, useRef, useState } from "react";
import { Car } from "../models/car";
import { ConflictZone } from "../models/confict_zone";
import { Road } from "../models/road";
import { Direction, dirs } from "../utils/dir_utils";

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
}

const initialIntersection = (numCol: number, numRow: number): Intersection => {
	const intersection: Intersection = {
		demoCar: new Car(0),
		cars: [],
		roadCollections: dirs.map((dir) => ({ dir, roads: Array.from(Array(numCol), (_, i) => new Road(i, dir)) })),
		zones: [],
		zonesSize: { numCol, numRow },
	};
	for (let i = 0; i < numCol; i++) {
		for (let j = 0; j < numRow; j++) {
			intersection.zones.push(new ConflictZone(i, j));
		}
	}
	for (const dir of dirs) {
		Road.numAllRoads[dir] = numCol;
	}
	return intersection;
};

function useCars() {
	const [intersection, setIntersection] = useState<Intersection>(initialIntersection(2, 2));
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
			const { roadCollections } = intersection;
			const roadsId = roadCollections.findIndex((roads) => roads.dir === road.dir);
			if (!roadCollections[roadsId].roads.find((e) => e.id == road.id)) {
				roadCollections[roadsId].roads.push(road);
			}
			Road.numAllRoads[road.dir] = roadCollections[roadsId].roads.length;
			updateZones(intersection);
			return { ...intersection };
		});
	}, []);

	const newCar = useCallback((road: Road) => {
		setIntersection((intersection) => {
			const { cars, demoCar } = intersection;
			const car = new Car(nextCarId.current, demoCar.color);
			nextCarId.current += 1;
			road.addCar(car);
			car.setInitialRoad(road);
			cars.push(car);

			// Regenerate a color for demo car
			demoCar.setRandomColor(demoCar.color);
			return { ...intersection };
		});
	}, []);

	const moveCar = (carId: number, road: Road) => {
		if (carId != 0) {
			setIntersection((intersection) => {
				const { cars } = intersection;
				const car = cars.find((car) => car.id == carId);
				if (car) {
					car.initialRoad.removeCar(car);
					road.addCar(car);
					car.setInitialRoad(road);
				}
				return { ...intersection };
			});
			// Aleady exists
		} else {
			// New car
			newCar(road);
		}
	};

	const setCars = useCallback((cars: Car[]) => {
		setIntersection((intersection) => {
			intersection.cars = cars;
			return { ...intersection };
		});
	}, []);

	return {
		intersection,
		moveCar,
		addRoad,
		setCars,
		...intersection,
	};
}

export default useCars;
