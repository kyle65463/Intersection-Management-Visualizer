import React from "react";
import { useDrag } from "react-dnd";
import { Intersection } from "../hooks/useCars";
import { Car, colorToStyle } from "../models/car";
import { carLength, carWidth, ItemTypes } from "../utils/constants";
import { getCarPos, getDemoCarPos } from "../utils/position_utils";

interface CarViewProps {
	car: Car;
	demo?: boolean;
	canDrag: boolean;
	intersection: Intersection;
}

function CarView({ car, demo, canDrag, intersection }: CarViewProps) {
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
				...(demo ? getDemoCarPos(intersection) : getCarPos(car, intersection)),
				width: `${demo ? carLength * 1.7 : carLength}px`,
				height: `${demo ? carWidth * 1.7 : carWidth}px`,
			}}
			ref={canDrag ? dragRef : undefined}
			className={`z-10 ${colorToStyle(car.color)} absolute duration-500 text-xs ${
				canDrag ? "cursor-pointer" : ""
			} rounded-md`}
		></div>
	);
}

export default CarView;
