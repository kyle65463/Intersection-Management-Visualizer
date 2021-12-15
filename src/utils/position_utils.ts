import { roadBorderHeight, roadHeight } from "./constants";

export function getRoadPos(numRoads: number, roadId: number) {
	const totalHeight = roadHeight - roadBorderHeight;
	return { top: `calc(50% - ${(numRoads / 2) * totalHeight}px + ${roadId * totalHeight}px)` };
}
