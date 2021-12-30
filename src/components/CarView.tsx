import React from "react";
import { useDrag } from "react-dnd";
import { Intersection } from "../hooks/useIntersection";
import { Car, colorToStyle } from "../models/car";
import { carLength, carWidth, ItemTypes } from "../utils/constants";
import { getCarPos, getDemoCarPos } from "../utils/position_utils";

interface CarViewProps {
	car: Car;
	demo?: boolean;
	canDrag: boolean;
	setPreviewingCar?: (car: Car) => void;
	setSelectingDestCar?: (car: Car) => void;
	intersection: Intersection;
}

function CarView({ car, demo, canDrag, intersection, setPreviewingCar, setSelectingDestCar }: CarViewProps) {
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
			onClick={!car.started ? () => setPreviewingCar?.(car) : undefined}
			onDoubleClick={!car.started ? () => setSelectingDestCar?.(car) : undefined}
			style={{
				...(demo ? getDemoCarPos(intersection) : getCarPos(car, intersection)),
				width: `${demo ? carLength * 1.7 : carLength}px`,
				height: `${demo ? carWidth * 1.7 : carWidth}px`,
			}}
			ref={canDrag ? dragRef : undefined}
			id={`car-${car.id}`}
			className={`${intersection.selectingDestCar == undefined ? "z-40" : "z-10"} ${colorToStyle(
				car.color
			)} absolute ${!car.started && !demo ? "" : "duration-500"} text-xs ${
				canDrag ? "cursor-pointer" : ""
			} rounded-md`}
		></div>
	);
}

export default CarView;
