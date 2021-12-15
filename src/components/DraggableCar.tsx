import React from "react";
import { useDrag } from "react-dnd";
import { ItemTypes } from "../utils/constants";

interface CarViewProps {
	id: number;
	roadId: number;
}

function CarView({ id, roadId }: CarViewProps) {
	const [{ opacity }, dragRef] = useDrag(
		() => ({
			type: ItemTypes.CAR,
			item: { id },
			collect: (monitor) => ({
				opacity: monitor.isDragging() ? 0.5 : 1,
			}),
		}),
		[]
	);

	return (
		<div style={{ top: `${roadId * 60}px` }} ref={dragRef} className='border-4 w-12 z-10 bg-red-500 absolute'>
			 car {id} 
		</div>
	);
}

export default CarView;
