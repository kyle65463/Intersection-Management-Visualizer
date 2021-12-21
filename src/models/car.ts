import { Direction, dirRoation, relativeDir } from "../utils/dir_utils";
import { ConflictZone } from "./confict_zone";
import { Road } from "./road";

type Turning = "clockwise" | "anti-clockwise" | "none";
type Color = "blue" | "red" | "green" | "yellow" | "amber" | "indigo" | "sky";

export function colorToStyle(color: Color) {
	switch (color) {
		case "blue":
			return "bg-blue-400";
		case "red":
			return "bg-red-400";
		case "green":
			return "bg-green-400";
		case "yellow":
			return "bg-yellow-400";
		case "amber":
			return "bg-amber-400";
		case "indigo":
			return "bg-indigo-400";
		case "sky":
			return "bg-sky-400";
	}
}

export class Car {
	constructor(id: number, color?: Color) {
		this.id = id;
		this.color = color ?? "blue";
	}

	public setInitialRoad = (road: Road) => {
		this.rotation = dirRoation[road.dir];
		this.dir = relativeDir(road.dir, "opposite");
		this.curZone = road;
		this.idOnRoad = road.numCars;
		this.initialRoad = road;
		this.initialIdOnRoad = road.numCars;
	};

	public setRandomColor = (exclude?: Color) => {
		const colors: any = ["blue", "red", "green", "yellow", "amber", "indigo", "sky"];
		let rand = Math.floor(Math.random() * Object.keys(colors).length);
		let randColor: Color = colors[Object.keys(colors)[rand]];
		while (randColor == exclude) {
			rand = Math.floor(Math.random() * Object.keys(colors).length);
			randColor = colors[Object.keys(colors)[rand]];
		}
		this.color = randColor;
	};

	public id: number;
	public dir: Direction = "right";
	public rotation: number = 0;
	public idOnRoad: number = -1;
	public initialRoad: Road = new Road(0, "right");
	public initialIdOnRoad: number = -1;
	public curZone: ConflictZone | Road = new Road(0, "right");
	public started = false;
	public turning: Turning = "none";
	public color: Color = "blue";
	public isEnd: boolean = false;
}
