import React from "react";
import { Road, Direction } from "../models/road";
import { getRoadBtnPos, getRoadPos } from "../utils/position_utils";
import RoadView from "./RoadView";

interface RoadsViewProps {
	dir: Direction;
	roads: Road[];
	addRoad: (road: Road) => void;
	moveCar: (carId: number, road: Road) => void;
}

function RoadsView({ dir, roads, addRoad, moveCar }: RoadsViewProps) {
	return (
		<>
			{roads.map((road) => (
				<RoadView key={road.id} road={road} moveCar={(carId: number) => moveCar(carId, road)} />
			))}
			<div className='absolute flex items-center text-center' style={getRoadBtnPos(roads)}>
				<button
					className='text-4xl font-light px-3 text-gray-600'
					onClick={() => {
						addRoad(new Road(roads.length, dir));
					}}
				>
					+
				</button>
				<button
					className='text-4xl font-light px-3 text-gray-600'
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
