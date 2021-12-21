export abstract class Zone {}

export class ConflictZone extends Zone {
	constructor(x: number, y: number) {
		super();
		this.col = x;
		this.row = y;
	}

	public col: number;
	public row: number;
	static numCols: number = 0;
	static numRows: number = 0;
}
