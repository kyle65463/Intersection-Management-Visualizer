import { roadHeight } from "./constants";

export function getRoadPos(numRoads: number, roadId: number) {
	const even = numRoads % 2 === 0;
	if (even) {
		return { top: `calc(50% - ${(numRoads / 2) * roadHeight}px + ${roadId * roadHeight}px)` };
	} else {
        return { top: `calc(50% - ${(numRoads / 2) * roadHeight}px + ${roadId * roadHeight}px)` };
	}
}
