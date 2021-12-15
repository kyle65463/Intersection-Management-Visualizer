import React from "react";
import { Road, RoadDirection } from "../models/road";
import RoadView from "./RoadView";

interface RoadsViewProps {
	dir: RoadDirection;
	roads: Road[];
	addRoad: (road: Road) => void;
}

function RoadsView({ dir, roads, addRoad }: RoadsViewProps) {
	return (
		<>
		<h1>{dir}</h1>
			{roads.map((road) => (
				<RoadView
					key={road.id}
					road={road}
					numRoads={roads.length}
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
