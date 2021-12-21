import React from "react";
import { useDrop } from "react-dnd";
import { Intersection } from "../hooks/useCars";
import { Road } from "../models/road";
import { ItemTypes, roadWidth } from "../utils/constants";
import { getRoadPos } from "../utils/position_utils";

interface RoadViewProps {
	road: Road;
	moveCar: (carId: number) => void;
	intersection: Intersection;
}

function RoadView({ road, moveCar, intersection }: RoadViewProps) {
	const [, drop] = useDrop(() => ({
		accept: ItemTypes.CAR,
		drop: (item: { id: number }) => {
			moveCar(item.id);
		},
	}));
	return (
		<div
			style={{ ...getRoadPos(road, intersection), height: `${roadWidth}px` }}
			className='absolute bg-gray-300 border-gray-500 border-y-2'
			ref={drop}
		>
			{road.numCars}
		</div>
	);
}

export default RoadView;
