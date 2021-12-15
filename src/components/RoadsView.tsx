import React from "react";
import { Road, RoadDirection } from "../models/road";
import RoadView from "./RoadView";

interface RoadsViewProps {
	dir: RoadDirection;
	roads: Road[];
	totalCol: number;
	totalRow: number;
	addRoad: (road: Road) => void;
}

function RoadsView({ dir, roads, addRoad, totalCol, totalRow }: RoadsViewProps) {
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
					moveCar={(carId: number) => {
						// setRoadId(road.id);
					}}
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
