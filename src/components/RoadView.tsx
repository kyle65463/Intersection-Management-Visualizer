import React from "react";
import { useDrop } from "react-dnd";
import { ItemTypes, roadHeight } from "../utils/constants";
import { getRoadPos } from "../utils/position_utils";

interface RoadViewProps {
	id: number;
	numRoads: number;
	moveCar: (carId: number) => void;
}

function RoadView({ id, numRoads, moveCar }: RoadViewProps) {
	const [, drop] = useDrop(() => ({
		accept: ItemTypes.CAR,
		drop: (item: { id: number }) => {
			console.log(item);
			moveCar(item.id);
		},
	}));
	return (
		<div
			style={getRoadPos(numRoads, id)}
			className='bg-gray-300 h-10 border-y-2 border-gray-500 absolute w-96'
			ref={drop}
		>
			road {id}
		</div>
	);
}

export default RoadView;
