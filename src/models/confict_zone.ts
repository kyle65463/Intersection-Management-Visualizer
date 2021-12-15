import { useCallback, useEffect, useState } from "react";

export class ConflictZone {
	constructor(x: number, y: number) {
		this.col = x;
		this.row = y;
	}

	public col: number;
	public row: number;
	static numCols: number = 1;
	static numRows: number = 1;
}

export function useConflictZones() {
	const [size, setSize] = useState({ col: 1, row: 1 });
	const [zones, setZones] = useState<ConflictZone[]>([]);
	useEffect(() => {
		ConflictZone.numCols = size.col;
		ConflictZone.numRows = size.row;
		for (let i = 0; i < size.col; i++) {
			for (let j = 0; j < size.row; j++) {
				zones.push(new ConflictZone(i, j));
			}
		}
		setZones([...zones]);
	}, [size.col, size.row]);
	return { zones, setSize };
}
