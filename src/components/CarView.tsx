import React from "react";
import { useDrag } from "react-dnd";
import { Car } from "../models/car";
import { carLength, carWidth, ItemTypes } from "../utils/constants";
import { getCarPos } from "../utils/position_utils";

interface CarViewProps {
	car: Car;
}

function CarView({ car }: CarViewProps) {
	const [{ opacity }, dragRef] = useDrag(
		() => ({
			type: ItemTypes.CAR,
			item: { id: car.id },
			collect: (monitor) => ({
				opacity: monitor.isDragging() ? 0.5 : 1,
			}),
		}),
		[]
	);

	return (
		<div
			style={{
				...getCarPos(car),
				width: `${carLength}px`,
				height: `${carWidth}px`,
			}}
			ref={dragRef}
			className={`z-10 bg-blue-400 absolute ${!car.started ? "" : "duration-1000"} text-xs`}
		>
			car {car.id}
		</div>
	);
}

export default CarView;
