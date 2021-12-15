import { RoadDirection } from "../models/road";
import { horizRoadLength, roadBorderWidth, roadWidth, vertRoadLength } from "./constants";

export function getRoadPos(dir: RoadDirection, numRoads: number, roadId: number) {
	const width = roadWidth - roadBorderWidth;
	let style = {};
	if (dir === "top" || dir === "bot") {
		style = { ...style, transform: "rotate(90deg)" };
		style = { ...style, width: `${vertRoadLength}px` };
		style = { ...style, right: `calc(50% - ${(numRoads / 2 + 1.5) * width}px + ${roadId * width}px)` };
		if (dir === "bot") {
			style = { ...style, bottom: "15%" };
		}
	} else {
		style = { ...style, top: `calc(50% - ${(numRoads / 2) * width}px + ${roadId * width}px)` };
		style = { ...style, width: `${horizRoadLength}px` };
		if (dir === "right") {
			style = { ...style, right: "0px" };
		}
	}
	return style;
}
