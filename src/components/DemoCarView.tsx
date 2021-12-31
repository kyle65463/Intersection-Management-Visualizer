import React from "react";
import { useDrag } from "react-dnd";
import Xarrow from "react-xarrows";
import { Intersection } from "../hooks/useIntersection";
import { Car, colorToStyle } from "../models/car";
import { carLength, carWidth, ItemTypes } from "../utils/constants";
import { getDemoCarPos } from "../utils/position_utils";

interface DemoCarViewProps {
	car: Car;
	canDrag: boolean;
	showHint: boolean;
	intersection: Intersection;
}

function DemoCarView({ car, canDrag, intersection, showHint }: DemoCarViewProps) {
	const [, dragRef] = useDrag(
		() => ({
			type: ItemTypes.CAR,
			item: { id: car.id },
		}),
		[]
	);

	return (
		<div
			style={{
				...getDemoCarPos(intersection),
				height: `85px`,
			}}
			className='absolute'
		>
			<p
				id='demo-car-hint'
				className={`text-lg ${showHint ? "text-gray-700" : "text-transparent"} font-mono font-bold`}
			>
				Drag the car to the road
			</p>
			<Xarrow
				showXarrow={showHint}
				path='grid'
				strokeWidth={3}
				headSize={4.2}
				color={showHint ? "rgba(55, 65, 81, 0.6)" : "transparent"}
				startAnchor={{ position: "bottom", offset: { x: -60, y: 5 } }}
				endAnchor={{ position: "left", offset: { x: -6 } }}
				start='demo-car-hint'
				end={`car-${car.id}`}
			/>
			<div
				style={{
					width: `${carLength * 1.7}px`,
					height: `${carWidth * 1.7}px`,
				}}
				ref={canDrag ? dragRef : undefined}
				id={`car-${car.id}`}
				className={`${intersection.selectingDestCar == undefined ? "z-40" : "z-10"} ${colorToStyle(
					car.color
				)} absolute bottom-0 right-5 ${canDrag ? "cursor-pointer" : ""} rounded-md`}
			></div>
		</div>
	);
}

export default DemoCarView;
