import { Intersection } from "../hooks/useIntersection";
import { Car } from "../models/car";
import { ConflictZone } from "../models/confict_zone";
import { Road } from "../models/road";
import { Direction } from "./dir_utils";

function getRoadOffset(dir: Direction, intersection: Intersection) {
	if (dir === "right") return rightRoadOffset(intersection);
	if (dir === "left") return leftRoadOffset(intersection);
	if (dir === "top") return topRoadOffset(intersection);
	if (dir === "bot") return botRoadOffset(intersection);
	return rightRoadOffset(intersection);
}

const rightRoadOffset = ({ zonesSize: { numRow }, roadCollections }: Intersection) =>
	~~((numRow - (roadCollections.find((col) => col.dir == "right")?.roads.length ?? 0)) / 2);
const leftRoadOffset = ({ zonesSize: { numRow }, roadCollections }: Intersection) =>
	~~((numRow - (roadCollections.find((col) => col.dir == "left")?.roads.length ?? 0)) / 2);
const topRoadOffset = ({ zonesSize: { numCol }, roadCollections }: Intersection) =>
	~~((numCol - (roadCollections.find((col) => col.dir == "top")?.roads.length ?? 0)) / 2);
const botRoadOffset = ({ zonesSize: { numCol }, roadCollections }: Intersection) =>
	~~((numCol - (roadCollections.find((col) => col.dir == "bot")?.roads.length ?? 0)) / 2);

const getRoad = (roadId: number, dir: Direction, { roadCollections }: Intersection) => {
	const col = roadCollections.find((col) => col.dir == dir);
	return col?.roads.find((road) => road.id == roadId);
};

const getConflictZone = (col: number, row: number, { zones }: Intersection) => {
	return zones.find((zone) => zone.col == col && zone.row == row);
};

export function getZoneFrontOfCar(car: Car, intersection: Intersection): Road | ConflictZone | undefined {
	const {
		zonesSize: { numCol, numRow },
	} = intersection;
	const { curZone, dir } = car;
	if (curZone instanceof ConflictZone) {
		let zoneCol: number = curZone.col;
		let zoneRow: number = curZone.row;
		let roadId: number | undefined = undefined;
		let roadDir: Direction | undefined = undefined;
		if (dir === "right") {
			if (curZone.col == numCol - 1) {
				roadId = curZone.row - rightRoadOffset(intersection);
				roadDir = "right";
			} else {
				zoneCol++;
			}
		} else if (dir === "left") {
			if (curZone.col == 0) {
				roadId = curZone.row - leftRoadOffset(intersection);
				roadDir = "left";
			} else {
				zoneCol--;
			}
		} else if (dir === "top") {
			if (curZone.row == 0) {
				roadId = curZone.col - topRoadOffset(intersection);
				roadDir = "top";
			} else {
				zoneRow--;
			}
		} else {
			if (curZone.row == numRow - 1) {
				roadId = curZone.col - botRoadOffset(intersection);
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
			zoneCol = numCol - 1;
			zoneRow = rightRoadOffset(intersection) + road.id;
		} else if (road.dir === "left") {
			zoneCol = 0;
			zoneRow = leftRoadOffset(intersection) + road.id;
		} else if (road.dir === "top") {
			zoneCol = topRoadOffset(intersection) + road.id;
			zoneRow = 0;
		} else {
			zoneCol = botRoadOffset(intersection) + road.id;
			zoneRow = numRow - 1;
		}
		return getConflictZone(zoneCol, zoneRow, intersection);
	}
}

export function getCarRoute(car: Car, intersection: Intersection): ConflictZone[] {
	const {
		zonesSize: { numCol, numRow },
	} = intersection;
	const { initialRoad, destRoad } = car;
	const route: ConflictZone[] = [];
	if (initialRoad && destRoad) {
		const initialRoadId = initialRoad.id + getRoadOffset(initialRoad.dir, intersection);
		const destRoadId = destRoad.id + getRoadOffset(destRoad.dir, intersection);
		switch (initialRoad.dir) {
			case "right":
				switch (destRoad.dir) {
					case "left":
						const breakPoint = Math.floor(numCol / 2);
						for (let i = numCol - 1; i >= breakPoint; i--) route.push({ col: i, row: initialRoadId });
						if (initialRoadId > destRoadId)
							for (let i = initialRoadId - 1; i >= destRoadId; i--)
								route.push({ col: breakPoint, row: i });
						else
							for (let i = initialRoadId + 1; i <= destRoadId; i++)
								route.push({ col: breakPoint, row: i });
						for (let i = breakPoint - 1; i >= 0; i--) route.push({ col: i, row: destRoadId });
						break;
					case "top":
						for (let i = numCol - 1; i >= destRoadId; i--) route.push({ col: i, row: initialRoadId });
						for (let i = initialRoadId - 1; i >= 0; i--) route.push({ col: destRoadId, row: i });
						break;
					case "bot":
						for (let i = numCol - 1; i >= destRoadId; i--) route.push({ col: i, row: initialRoadId });
						for (let i = initialRoadId + 1; i < numRow; i++) route.push({ col: destRoadId, row: i });
						break;
				}
				break;
			case "left":
				switch (destRoad.dir) {
					case "right":
						let breakPoint = Math.floor(numCol / 2);
						if (numCol % 2 == 0) breakPoint--;
						for (let i = 0; i <= breakPoint; i++) route.push({ col: i, row: initialRoadId });
						if (initialRoadId > destRoadId)
							for (let i = initialRoadId - 1; i >= destRoadId; i--)
								route.push({ col: breakPoint, row: i });
						else
							for (let i = initialRoadId + 1; i <= destRoadId; i++)
								route.push({ col: breakPoint, row: i });
						for (let i = breakPoint + 1; i < numCol; i++) route.push({ col: i, row: destRoadId });
						break;
					case "top":
						for (let i = 0; i <= destRoadId; i++) route.push({ col: i, row: initialRoadId });
						for (let i = initialRoadId - 1; i >= 0; i--) route.push({ col: destRoadId, row: i });
						break;
					case "bot":
						for (let i = 0; i <= destRoadId; i++) route.push({ col: i, row: initialRoadId });
						for (let i = initialRoadId + 1; i < numRow; i++) route.push({ col: destRoadId, row: i });
						break;
				}
				break;
			case "top":
				switch (destRoad.dir) {
					case "bot":
						let breakPoint = Math.floor(numRow / 2);
						if (numRow % 2 == 0) breakPoint--;
						for (let i = 0; i <= breakPoint; i++) route.push({ col: initialRoadId, row: i });
						if (initialRoadId > destRoadId)
							for (let i = initialRoadId - 1; i >= destRoadId; i--)
								route.push({ col: i, row: breakPoint });
						else
							for (let i = initialRoadId + 1; i <= destRoadId; i++)
								route.push({ col: i, row: breakPoint });
						for (let i = breakPoint + 1; i < numRow; i++) route.push({ col: destRoadId, row: i });
						break;
					case "left":
						for (let i = 0; i <= destRoadId; i++) route.push({ col: initialRoadId, row: i });
						for (let i = initialRoadId - 1; i >= 0; i--) route.push({ col: i, row: destRoadId });
						break;
					case "right":
						for (let i = 0; i <= destRoadId; i++) route.push({ col: initialRoadId, row: i });
						for (let i = initialRoadId + 1; i < numCol; i++) route.push({ col: i, row: destRoadId });
						break;
				}
				break;
			case "bot":
				switch (destRoad.dir) {
					case "top":
						let breakPoint = Math.floor(numRow / 2);
						for (let i = numRow - 1; i >= breakPoint; i--) route.push({ col: initialRoadId, row: i });
						if (initialRoadId > destRoadId)
							for (let i = initialRoadId - 1; i >= destRoadId; i--)
								route.push({ col: i, row: breakPoint });
						else
							for (let i = initialRoadId + 1; i <= destRoadId; i++)
								route.push({ col: i, row: breakPoint });
						for (let i = breakPoint - 1; i >= 0; i--) route.push({ col: destRoadId, row: i });
						break;
					case "left":
						for (let i = numRow - 1; i >= destRoadId; i--) route.push({ col: initialRoadId, row: i });
						for (let i = initialRoadId - 1; i >= 0; i--) route.push({ col: i, row: destRoadId });
						break;
					case "right":
						for (let i = numRow - 1; i >= destRoadId; i--) route.push({ col: initialRoadId, row: i });
						for (let i = initialRoadId + 1; i < numCol; i++) route.push({ col: i, row: destRoadId });
						break;
				}
				break;
		}
	}
	return route;
}
