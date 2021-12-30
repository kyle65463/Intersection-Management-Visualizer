import { Intersection } from "../hooks/useIntersection";
import { Color } from "../models/car";
import { roadWidth } from "./constants";
import { Direction } from "./dir_utils";

export function arrowAnchorOffset(dir: Direction, type: "start" | "end") {
	if (type === "end")
		switch (dir) {
			case "right":
				return {
					x: roadWidth * 0.7,
				};
			case "left":
				return {
					x: -roadWidth * 0.7,
				};
			case "top":
				return {
					y: -roadWidth * 0.7,
				};
			case "bot":
				return {
					y: roadWidth * 0.7,
				};
		}
	else
		switch (dir) {
			case "right":
				return {
					x: roadWidth / 2,
				};
			case "left":
				return {
					x: -roadWidth / 2,
				};
			case "top":
				return {
					y: -roadWidth / 2,
				};
			case "bot":
				return {
					y: roadWidth / 2,
				};
		}
}

export function arrowGridBreak(intersection: Intersection, srcDir: Direction, destDir: Direction) {
	if ((srcDir === "left" && destDir === "right") || (srcDir === "right" && destDir === "left")) {
		if (intersection.zonesSize.numCol % 2 === 0)
			return `${((intersection.zonesSize.numCol / 2 - 0.5) / intersection.zonesSize.numCol) * 100}%4`;
	}
	if ((srcDir === "top" && destDir === "bot") || (srcDir === "bot" && destDir === "top")) {
		if (intersection.zonesSize.numRow % 2 === 0)
			return `${((intersection.zonesSize.numRow / 2 - 0.5) / intersection.zonesSize.numRow) * 100}%4`;
	}
	return "50%";
}

export function colorMapper(color: Color) {
	switch (color) {
		case "blue":
			return "rgba(96, 165, 250, 1)";
		case "red":
			return "rgba(248, 113, 113, 1)";
		case "green":
			return "rgba(74, 222, 128, 1)";
		case "yellow":
			return "rgba(250, 204, 21, 1)";
		case "amber":
			return "rgba(251, 191, 36, 1)";
		case "indigo":
			return "rgba(129, 140, 248, 1)";
		case "sky":
			return "rgba(56, 189, 248, 1)";
	}
	return "rgba(0, 0, 100, 1)";
}
