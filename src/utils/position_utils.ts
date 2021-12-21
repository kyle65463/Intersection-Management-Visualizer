import { Car } from "../models/car";
import { ConflictZone } from "../models/confict_zone";
import { Road } from "../models/road";
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

export function getCarPos({ road, zone, rotation, turning, dir, idOnRoad }: Car) {
	let style = {};
	if (road && idOnRoad) {
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
				left: `${
					getZonePos(0, road.id, { left: `-${roadWidth * idOnRoad}px + ${(roadWidth - carLength) / 2}px` })
						.left
				}`,
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
						left: `${roadWidth * idOnRoad}px + ${(roadWidth - carLength) / 2}px`,
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
							top: `${roadWidth * idOnRoad}px + ${(roadWidth - carLength) / 2}px`,
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
					top: `${
						getZonePos(road.id, 0, {
							top: `-${roadWidth * (idOnRoad - 1)}px - ${(roadWidth - carLength) / 2}px`,
						}).top
					}`,
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
		let topOffset = "0px";
		let leftOffset = "0px";
		if (rotation % 180 === 0) {
			topOffset = `calc(${(roadWidth - carWidth) / 2}px)`;
			leftOffset = `calc(${(roadWidth - carLength) / 2}px)`;
		}
		if (rotation % 180 === 45 || rotation % 180 === -135) {
			let ot = 8;
			let ol = 8;
			let o2 = 4;
			if (turning === "clockwise") {
				if (dir === "bot" || dir === "right") {
					ot += o2;
					ol -= o2;
				} else {
					ot -= o2;
					ol += o2;
				}
			} else if (turning === "anti-clockwise") {
				if (dir === "top" || dir === "left") {
					ot += o2;
					ol -= o2;
				} else {
					ot -= o2;
					ol += o2;
				}
			}
			style = { ...style, transform: `rotate(${rotation}deg)` };
			topOffset = `calc(${(roadWidth - carLength) / 2 + ot}px)`;
			leftOffset = `calc(${ol}px)`;
		}
		if (rotation % 180 === 90 || rotation % 180 === -90) {
			style = { ...style, transform: `rotate(${rotation}deg)` };
			topOffset = `calc(${(roadWidth - carWidth) / 2}px)`;
			leftOffset = `calc(${(roadWidth - carLength) / 2}px)`;
		}
		if (rotation % 180 === 135 || rotation % 180 === -45) {
			let ot = 8;
			let ol = 8;
			let o2 = 4;
			if (turning === "clockwise") {
				if (dir === "right" || dir === "top") {
					ot += o2;
					ol += o2;
				} else {
					ot -= o2;
					ol -= o2;
				}
			} else if (turning === "anti-clockwise") {
				if (dir === "left" || dir === "bot") {
					ot += o2;
					ol += o2;
				} else {
					ot -= o2;
					ol -= o2;
				}
			}
			style = { ...style, transform: `rotate(${rotation}deg)` };
			topOffset = `calc(${(roadWidth - carLength) / 2 + ot}px)`;
			leftOffset = `calc(${ol}px)`;
		}
		style = { ...style, transform: `rotate(${rotation}deg)` };
		style = {
			...style,
			top: getZonePos(zone.col, zone.row, { top: topOffset }).top,
			left: getZonePos(zone.col, zone.row, { left: leftOffset }).left,
		};
	}
	return style;
}

export function getRoadBtnPos(roads: Road[]) {
	const { dir, numRoads, id: roadId } = roads[roads.length - 1];
	let style = {};
	if (dir === "top" || dir === "bot") {
		const startIndex = ~~((ConflictZone.numCols - numRoads) / 2) + 1;
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
				display: "flex",
				justifyContent: "end",
			};
		} else {
			style = {
				...style,
				top: `${getZonePos(roadId, 0, { top: `-${vertRoadLength}px` }).top}`,
			};
		}
	} else {
		const startIndex = ~~((ConflictZone.numRows - numRoads) / 2) + 1;
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
				display: "flex",
				justifyContent: "end",
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

export function getDemoCarPos() {
	const leftRoad = new Road(-4, "top");
	const topRoad = new Road(-2, "left");
	return {
		top: (getRoadPos(topRoad) as any).top,
		left: (getRoadPos(leftRoad) as any).left,
	};
}
