import { RoadDirection } from "../models/road";
import { horizRoadLength, roadBorderWidth, roadWidth, vertRoadLength } from "./constants";

export function getRoadPos(dir: RoadDirection, totalRoads: number, totalCol: number, totalRow: number, roadId: number) {
	let style = {};
	if (dir === "top" || dir === "bot") {
		const startIndex = ~~((totalCol - totalRoads) / 2);
		style = { ...style, transform: "rotate(90deg)", transformOrigin: "left top" };
		style = { ...style, width: `${vertRoadLength}px` };
		style = {
			...style,
			left: getZonePos(roadId + 1 + startIndex, 0, totalCol, totalRow, { left: `${roadBorderWidth}px` }).left,
		};
		if (dir === "bot") {
			style = {
				...style,
				top: `${getZonePos(roadId, totalRow - 1, totalCol, totalRow, { top: `${roadWidth}px` }).top}`,
			};
		} else {
			style = {
				...style,
				top: `${getZonePos(roadId, 0, totalCol, totalRow, { top: `-${vertRoadLength}px` }).top}`,
			};
		}
	} else {
		const startIndex = ~~((totalRow - totalRoads) / 2);
		style = { ...style, width: `${horizRoadLength}px` };
		style = { ...style, top: getZonePos(0, roadId + startIndex, totalCol, totalRow).top };
		if (dir === "right") {
			style = {
				...style,
				left: `${getZonePos(totalCol - 1, roadId, totalCol, totalRow, { left: `${roadWidth}px` }).left}`,
			};
		} else {
			style = {
				...style,
				left: `${getZonePos(0, roadId, totalCol, totalRow, { left: `-${horizRoadLength}px` }).left}`,
			};
		}
	}
	return style;
}

export function getZonePos(
	col: number,
	row: number,
	totalCol: number,
	totalRow: number,
	offset: { left?: string; top?: string } = { left: "0px", top: "0px" }
) {
	const width = roadWidth - roadBorderWidth;
	let style: { top: string; left: string; width: string; height: string } = {
		width: `${roadWidth}px`,
		height: `${roadWidth}px`,
		top: `calc(50% - ${(totalRow / 2) * width}px + ${row * width}px + ${offset.top})`,
		left: `calc(50% - ${(totalCol / 2) * width}px + ${col * width}px + ${offset.left})`,
	};
	return style;
}
