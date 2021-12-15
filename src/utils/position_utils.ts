import { Car } from "../models/car";
import { ConflictZone } from "../models/confict_zone";
import { Direction, Road } from "../models/road";
import { carLength, carWidth, horizRoadLength, roadBorderWidth, roadWidth, vertRoadLength } from "./constants";

export function getRoadPos({ dir, numRoads, id: roadId }: Road) {
	let style = {};
	if (dir === "top" || dir === "bot") {
		const startIndex = ~~((ConflictZone.numCols - numRoads) / 2);
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
		const startIndex = ~~((ConflictZone.numRows - numRoads) / 2);
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

function getRelativeDir(
	road?: Road,
	zone?: ConflictZone,
	lastRoad?: Road,
	lastZone?: ConflictZone
): Direction | undefined {
	if (road && zone) return;
	if (lastRoad && lastZone) return;
	if (road) {
		if (lastZone) {
			const dir = getRelativeDir(lastRoad, lastZone, road, zone);
			if (dir === "right") return "left";
			if (dir === "left") return "right";
			if (dir === "top") return "bot";
			if (dir === "bot") return "top";
		}
	} else if (zone) {
		if (lastZone) {
			if (zone.col == lastZone.col + 1 && zone.row == lastZone.row) {
				return "right";
			} else if (zone.col == lastZone.col - 1 && zone.row == lastZone.row) {
				return "left";
			} else if (zone.col == lastZone.col && zone.row == lastZone.row - 1) {
				return "top";
			} else if (zone.col == lastZone.col && zone.row == lastZone.row + 1) {
				return "bot";
			}
		} else if (lastRoad) {
			if (lastRoad.dir === "left" || lastRoad.dir === "right") {
				const startIndex = ~~((ConflictZone.numRows - lastRoad.numRoads) / 2);
				if (startIndex + lastRoad.id === zone.row) {
					if (lastRoad.dir === "left" && zone.col == 0) {
						return "right";
					} else if (lastRoad.dir === "right" && zone.col == ConflictZone.numCols - 1) {
						return "left";
					}
				}
			} else {
				const startIndex = ~~((ConflictZone.numCols - lastRoad.numRoads) / 2);
				if (startIndex + lastRoad.id === zone.col) {
					if (lastRoad.dir === "top" && zone.row == 0) {
						return "bot";
					} else if (lastRoad.dir === "bot" && zone.row == ConflictZone.numRows - 1) {
						return "top";
					}
				}
			}
		}
	}
}

export function getCarPos({ road, zone, rotation }: Car) {
	let style = {};
	if (road) {
		const numRoads = road?.numRoads;
		if (road.dir === "left") {
			const startIndex = ~~((ConflictZone.numRows - numRoads) / 2);
			style = { ...style, transform: `rotate(${rotation}deg)` };
			style = {
				...style,
				top: getZonePos(0, road.id + startIndex, { top: `${(roadWidth - carWidth) / 2}px` }).top,
			};
			style = {
				...style,
				left: `${getZonePos(0, road.id, { left: `-${carLength}px` }).left}`,
			};
		} else if (road.dir === "right") {
			const startIndex = ~~((ConflictZone.numRows - numRoads) / 2);
			style = { ...style, transform: `rotate(${rotation}deg)` };
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
			const startIndex = ~~((ConflictZone.numCols - numRoads) / 2);
			style = { ...style, width: `${vertRoadLength}px` };

			if (road.dir === "bot") {
				style = { ...style, transform: `rotate(${rotation}deg)`, transformOrigin: "left top" };
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
				style = { ...style, transform: `rotate(${rotation}deg)`, transformOrigin: "left top" };
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
		style = { ...style, transform: `rotate(${rotation}deg)` };
		style = {
			...style,
			top: getZonePos(zone.col, zone.row).top,
			left: getZonePos(zone.col, zone.row).left,
		};
	}
	return style;
}
