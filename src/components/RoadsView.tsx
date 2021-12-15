import React from "react";
import { Road, Direction } from "../models/road";
import RoadView from "./RoadView";

interface RoadsViewProps {
	dir: Direction;
	roads: Road[];
	totalCol: number;
	totalRow: number;
	addRoad: (road: Road) => void;
	moveCar: (carId: number, road: Road) => void;
}

function RoadsView({ dir, roads, addRoad, totalCol, totalRow, moveCar }: RoadsViewProps) {
	return (
		<>
			<h1>{dir}</h1>
			{roads.map((road) => (
				<RoadView
					key={road.id}
					road={road}
					totalRoads={roads.length}
					totalCol={totalCol}
					totalRow={totalRow}
					moveCar={(carId: number) => moveCar(carId, road)}
				/>
			))}
			<button
				className='btn'
				onClick={() => {
					addRoad(new Road(roads.length, dir));
				}}
			>
				add
			</button>
		</>
	);
}

export default RoadsView;
