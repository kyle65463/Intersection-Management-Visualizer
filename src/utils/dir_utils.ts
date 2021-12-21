export type Direction = "left" | "right" | "top" | "bot";

export const dirs = [];

export const dirRoation = {
	left: 0,
	right: 180,
	top: -90,
	bot: 90,
};

export function relativeDir(dir: Direction, type: "clockwise" | "anti-clockwise" | "opposite"): Direction {
	switch (dir) {
		case "right":
			switch (type) {
				case "clockwise":
					return "bot";
				case "anti-clockwise":
					return "top";
				case "opposite":
					return "left";
			}
		case "left":
			switch (type) {
				case "clockwise":
					return "top";
				case "anti-clockwise":
					return "bot";
				case "opposite":
					return "right";
			}
		case "top":
			switch (type) {
				case "clockwise":
					return "right";
				case "anti-clockwise":
					return "left";
				case "opposite":
					return "bot";
			}
		case "bot":
			switch (type) {
				case "clockwise":
					return "left";
				case "anti-clockwise":
					return "right";
				case "opposite":
					return "top";
			}
	}
}
