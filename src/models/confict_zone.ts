import { useState } from "react";

export class ConflictZone {
	constructor(x: number, y: number) {
		this.col = x;
		this.row = y;
	}

	public col: number;
	public row: number;
}

export function useConflictZones() {
	const [col, setCol] = useState(1);
	const [row, setRow] = useState(1);
	const zones: ConflictZone[] = [];
	for (let i = 0; i < col; i++) {
		for (let j = 0; j < row; j++) {
			zones.push(new ConflictZone(i, j));
		}
	}
	return { zones, col, row, setRow, setCol };
}
