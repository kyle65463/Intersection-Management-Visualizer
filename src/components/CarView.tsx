import React from "react";
import { useDrag } from "react-dnd";
import { Car, colorToStyle } from "../models/car";
import { carLength, carWidth, ItemTypes } from "../utils/constants";
import { getCarPos, getDemoCarPos } from "../utils/position_utils";

interface CarViewProps {
	car: Car;
	demo?: boolean;
}

function CarView({ car, demo }: CarViewProps) {
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
				...(demo ? getDemoCarPos() : getCarPos(car)),
				width: `${carLength}px`,
				height: `${carWidth}px`,
			}}
			ref={dragRef}
			className={`z-10 ${colorToStyle(car.color)} absolute ${
				!car.started ? "" : "duration-500"
			} text-xs cursor-pointer`}
		>
			car {car.id}
		</div>
	);
}

export default CarView;
