import { ConflictZone } from "../models/confict_zone";
import { Direction, Road } from "../models/road";
import { carLength, carWidth, horizRoadLength, roadBorderWidth, roadWidth, vertRoadLength } from "./constants";

export function getRoadPos(dir: Direction, totalRoads: number, roadId: number) {
	let style = {};
	if (dir === "top" || dir === "bot") {
		const startIndex = ~~((ConflictZone.numCols - totalRoads) / 2);
		style = { ...style, transform: "rotate(90deg)", transformOrigin: "left top" };
		style = { ...style, width: `${vertRoadLength}px` };
		style = {
			...style,
			left: getZonePos(roadId + 1 + startIndex, 0, {
				left: `${roadBorderWidth}px`,
			}).left,
		};
		if (dir === "bot") {
			style = {
				...style,
				top: `${
					getZonePos(roadId, ConflictZone.numRows - 1, {
						top: `${roadWidth}px`,
					}).top
				}`,
			};
		} else {
			style = {
				...style,
				top: `${getZonePos(roadId, 0, { top: `-${vertRoadLength}px` }).top}`,
			};
		}
	} else {
		const startIndex = ~~((ConflictZone.numRows - totalRoads) / 2);
		style = { ...style, width: `${horizRoadLength}px` };
		style = { ...style, top: getZonePos(0, roadId + startIndex).top };
		if (dir === "right") {
			style = {
				...style,
				left: `${
					getZonePos(ConflictZone.numCols - 1, roadId, {
						left: `${roadWidth}px`,
					}).left
				}`,
			};
		} else {
			style = {
				...style,
				left: `${getZonePos(0, roadId, { left: `-${horizRoadLength}px` }).left}`,
			};
		}
	}
	return style;
}

export function getZonePos(
	col: number,
	row: number,
	offset: { left?: string; top?: string } = { left: "0px", top: "0px" }
) {
	const width = roadWidth - roadBorderWidth;
	let style: { top: string; left: string; width: string; height: string } = {
		width: `${roadWidth}px`,
		height: `${roadWidth}px`,
		top: `calc(50% - ${(ConflictZone.numRows / 2) * width}px + ${row * width}px + ${offset.top})`,
		left: `calc(50% - ${(ConflictZone.numCols / 2) * width}px + ${col * width}px + ${offset.left})`,
	};
	return style;
}

export function getCarPos({ road, zone, totalRoads }: { road?: Road; zone?: ConflictZone; totalRoads: number }) {
	let style = {};
	if (road) {
		if (road.dir === "left") {
			const startIndex = ~~((ConflictZone.numRows - totalRoads) / 2);
			style = {
				...style,
				top: getZonePos(0, road.id + startIndex, { top: `${(roadWidth - carWidth) / 2}px` }).top,
			};
			style = {
				...style,
				left: `${getZonePos(0, road.id, { left: `-${carLength}px` }).left}`,
			};
		} else if (road.dir === "right") {
			const startIndex = ~~((ConflictZone.numRows - totalRoads) / 2);
			style = { ...style, transform: "rotate(180deg)" };
			style = {
				...style,
				top: getZonePos(0, road.id + startIndex, {
					top: `${(roadWidth - carWidth) / 2}px`,
				}).top,
			};
			style = {
				...style,
				left: `${
					getZonePos(ConflictZone.numCols - 1, road.id, {
						left: `${roadWidth}px`,
					}).left
				}`,
			};
		} else {
			const startIndex = ~~((ConflictZone.numCols - totalRoads) / 2);
			style = { ...style, width: `${vertRoadLength}px` };

			if (road.dir === "bot") {
				style = { ...style, transform: "rotate(90deg)", transformOrigin: "left top" };
				style = {
					...style,
					top: `${
						getZonePos(road.id, ConflictZone.numRows - 1, {
							top: `${roadWidth}px`,
						}).top
					}`,
				};
				style = {
					...style,
					left: getZonePos(road.id + startIndex, 0, {
						left: `${roadBorderWidth / 2}px + ${carWidth}px + ${(roadWidth - carWidth) / 2}px`,
					}).left,
				};
			} else {
				style = { ...style, transform: "rotate(-90deg)", transformOrigin: "left top" };
				style = {
					...style,
					top: `${getZonePos(road.id, 0).top}`,
				};
				style = {
					...style,
					left: getZonePos(road.id + startIndex, 0, {
						left: `${roadBorderWidth / 2}px + ${(roadWidth - carWidth) / 2}px`,
					}).left,
				};
			}
		}
	} else if (zone) {
	}
	return style;
}
