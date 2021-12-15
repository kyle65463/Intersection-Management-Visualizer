import React from "react";
import { useDrag } from "react-dnd";
import { ItemTypes } from "../utils/constants";

function DraggableCar ()  {
	const [{ opacity }, dragRef] = useDrag(
		() => ({
			type: ItemTypes.CAR,
			collect: (monitor) => ({
				opacity: monitor.isDragging() ? 0.5 : 1,
			}),
		}),
		[]
	);

	return (
		<div ref={dragRef}>
			<div className="border-4 w-12"> car </div>
		</div>
	);
};

export default DraggableCar;
