import { Intersection } from "../hooks/useCars";
import { Car } from "../models/car";
import { ConflictZone } from "../models/confict_zone";
import { Road } from "../models/road";
import { Direction } from "./dir_utils";

const rightRoadOffset = () => ~~((ConflictZone.numRows - Road.numAllRoads.right) / 2);
const leftRoadOffset = () => ~~((ConflictZone.numRows - Road.numAllRoads.left) / 2);
const topRoadOffset = () => ~~((ConflictZone.numCols - Road.numAllRoads.top) / 2);
const botRoadOffset = () => ~~((ConflictZone.numCols - Road.numAllRoads.bot) / 2);

const getRoad = (roadId: number, dir: Direction, { roadCollections }: Intersection) => {
	const col = roadCollections.find((col) => col.dir == dir);
	return col?.roads.find((road) => road.id == roadId);
};

const getConflictZone = (col: number, row: number, { zones }: Intersection) => {
	return zones.find((zone) => zone.col == col && zone.row == row);
};

export function getZoneFrontOfCar(car: Car, intersection: Intersection): Road | ConflictZone | undefined {
	const { curZone, dir } = car;
	if (curZone instanceof ConflictZone) {
		let zoneCol: number = curZone.col;
		let zoneRow: number = curZone.row;
		let roadId: number | undefined = undefined;
		let roadDir: Direction | undefined = undefined;
		if (dir === "right") {
			if (curZone.col == ConflictZone.numCols - 1) {
				roadId = curZone.row - rightRoadOffset();
				roadDir = "right";
			} else {
				zoneCol++;
			}
		} else if (dir === "left") {
			if (curZone.col == 0) {
				roadId = curZone.row - leftRoadOffset();
				roadDir = "left";
			} else {
				zoneCol--;
			}
		} else if (dir === "top") {
			if (curZone.row == 0) {
				roadId = curZone.col - topRoadOffset();
				roadDir = "top";
			} else {
				zoneRow--;
			}
		} else {
			if (curZone.row == ConflictZone.numRows - 1) {
				roadId = curZone.col - botRoadOffset();
				roadDir = "bot";
			} else {
				zoneRow++;
			}
		}
		if (roadId != undefined && roadDir != undefined) {
			return getRoad(roadId, roadDir, intersection);
		}
		return getConflictZone(zoneCol, zoneRow, intersection);
	} else if (curZone instanceof Road) {
		const road: Road = curZone;
		let zoneCol: number | undefined = undefined;
		let zoneRow: number | undefined = undefined;
		if (road.dir === "right") {
			zoneCol = ConflictZone.numCols - 1;
			zoneRow = rightRoadOffset() + road.id;
		} else if (road.dir === "left") {
			zoneCol = 0;
			zoneRow = leftRoadOffset() + road.id;
		} else if (road.dir === "top") {
			zoneCol = topRoadOffset() + road.id;
			zoneRow = 0;
		} else {
			zoneCol = botRoadOffset() + road.id;
			zoneRow = ConflictZone.numRows - 1;
		}
		return getConflictZone(zoneCol, zoneRow, intersection);
	}
}
