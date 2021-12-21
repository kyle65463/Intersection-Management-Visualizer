export class ConflictZone {
	constructor(x: number, y: number) {
		this.col = x;
		this.row = y;
	}

	public col: number;
	public row: number;
	static numCols: number = 0;
	static numRows: number = 0;
}
