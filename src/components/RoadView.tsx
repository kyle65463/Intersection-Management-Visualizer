import React from "react";
import { useDrop } from "react-dnd";
import { Intersection } from "../hooks/useIntersection";
import { Road } from "../models/road";
import { ItemTypes, maxRoadNum, roadWidth } from "../utils/constants";
import { relativeDir } from "../utils/dir_utils";
import { getRoadPos } from "../utils/position_utils";

interface RoadViewProps {
	road: Road;
	isDragging: boolean;
	moveCar: (carId: number) => void;
	setCarDest: () => void;
	intersection: Intersection;
}

function RoadView({ road, isDragging, moveCar, setCarDest, intersection }: RoadViewProps) {
	const { selectingDestCar } = intersection;
	const isSelectable =
		selectingDestCar && selectingDestCar.dir != relativeDir(road.dir, "opposite") && road.cars.length == 0;
	const isDropable = isDragging && !road.isDest && road.cars.length < maxRoadNum;

	const [, drop] = useDrop(() => ({
		accept: ItemTypes.CAR,
		drop: (item: { id: number }) => {
			if (road.isDest) {
				// TODO Give a warning
			} else {
				moveCar(item.id);
			}
		},
	}));

	return (
		<div
			style={{ ...getRoadPos(road, intersection), height: `${roadWidth}px` }}
			id={`road-${road.dir}-${road.id}`}
			className={`absolute bg-gray-300 border-gray-500 border-y-2 ${
				isSelectable || isDropable ? "z-30 cursor-pointer" : ""
			}`}
			onClick={isSelectable ? setCarDest : undefined}
			ref={drop}
		></div>
	);
}

export default RoadView;
