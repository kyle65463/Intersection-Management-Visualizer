import React from "react";
import { Intersection } from "../hooks/useIntersection";
import { Road } from "../models/road";
import { Direction } from "../utils/dir_utils";
import { getRoadBtnPos } from "../utils/position_utils";
import RoadView from "./RoadView";

interface RoadsViewProps {
	dir: Direction;
	roads: Road[];
	addRoad: (road: Road) => void;
	moveCar: (carId: number, road: Road) => void;
	intersection: Intersection;
}

function RoadsView({ dir, roads, addRoad, moveCar, intersection }: RoadsViewProps) {
	return (
		<>
			{roads.map((road) => (
				<RoadView
					key={road.id}
					road={road}
					moveCar={(carId: number) => moveCar(carId, road)}
					intersection={intersection}
				/>
			))}
			<div className='absolute flex items-center text-center' style={getRoadBtnPos(roads, intersection)}>
				<button
					className='px-3 text-4xl font-light text-gray-600'
					onClick={() => {
						addRoad(new Road(roads.length, dir));
					}}
				>
					+
				</button>
				<button
					className='px-3 text-4xl font-light text-gray-600'
					onClick={() => {
						addRoad(new Road(roads.length, dir));
					}}
				>
					-
				</button>
			</div>
		</>
	);
}

export default RoadsView;
