import React from "react";
import { useDrag } from "react-dnd";
import { Car } from "../models/car";
import { carLength, carWidth, ItemTypes } from "../utils/constants";
import { getCarPos } from "../utils/position_utils";

interface CarViewProps {
	car: Car;
	totalRoads: number;
	totalCol: number;
	totalRow: number;
}

function CarView({ car, totalRoads, totalCol, totalRow }: CarViewProps) {
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
				...getCarPos({ road: car.road, zone: car.zone, totalCol, totalRow, totalRoads }),
				width: `${carLength}px`,
				height: `${carWidth}px`,
			}}
			ref={dragRef}
			className='z-10 bg-blue-400 absolute duration-1000 text-xs'
		>
			car {car.id}
		</div>
	);
}

export default CarView;
