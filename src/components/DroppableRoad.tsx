import React from "react";
import { useDrop } from "react-dnd";
import { ItemTypes } from "../utils/constants";

function Road() {
	const [, drop] = useDrop(() => ({
		accept: ItemTypes.CAR,
	}));
	return (
		<div className='bg-gray-400 my-4 h-10' ref={drop}>
			road
		</div>
	);
}

export default Road;
