import React from "react";
import { useDrop } from "react-dnd";
import { ItemTypes } from "../utils/constants";

interface RoadViewProps {
	id: number;
	moveCar: (carId: number) => void;
}

function RoadView({ id, moveCar }: RoadViewProps) {
	const [, drop] = useDrop(() => ({
		accept: ItemTypes.CAR,
		drop: (item: { id: number }) => {
            console.log(item)
			moveCar(item.id);
		},
	}));
	return (
		<div style={{ top: `${id * 60}px` }} className='bg-gray-400 h-10 absolute w-96' ref={drop}>
			road {id}
		</div>
	);
}

export default RoadView;
