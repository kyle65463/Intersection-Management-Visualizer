import Head from "next/head";
import { useCallback, useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import CarView from "../components/CarView";
import ConflictZoneView from "../components/ConflictZoneView";
import RoadsView from "../components/RoadsView";
import { Car } from "../models/car";
import { useConflictZones } from "../models/confict_zone";
import { Road, Direction } from "../models/road";

function Home() {
	const dirs: Direction[] = ["left", "right", "top", "bot"];
	const [roadCollections, setRoads] = useState(dirs.map((dir) => ({ dir, roads: [new Road(0, dir)] })));
	const { zones, col, row, setCol, setRow } = useConflictZones();
	const [car, setCar] = useState(new Car(0));

	const getTotalRoads = (road?: Road) => {
		let res = 0;
		if (road) {
			roadCollections.forEach((collection) => {
				if (collection.dir === road.dir) {
					res = collection.roads.length;
				}
			});
		}
		return res;
	};

	const addRoad = useCallback(
		(road: Road) => {
			const roadsId = roadCollections.findIndex((roads) => roads.dir === road.dir);
			roadCollections[roadsId].roads.push(road);
			setRoads([...roadCollections]);
		},
		[roadCollections]
	);

	useEffect(() => {
		let col = 0;
		let row = 0;
		roadCollections.forEach((collection) => {
			if (collection.dir === "left" || collection.dir === "right") {
				row = Math.max(row, collection.roads.length);
			} else {
				col = Math.max(col, collection.roads.length);
			}
		});
		setCol(col);
		setRow(row);
	}, [roadCollections]);

	return (
		<DndProvider backend={HTML5Backend}>
			<Head>
				<title>Title</title>
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<main className='container mx-auto py-5 relative min-h-screen'>
				<CarView car={car} totalRoads={getTotalRoads(car.road)} totalCol={col} totalRow={row} />
				{roadCollections.map((roads, i) => (
					<RoadsView
						key={i}
						{...roads}
						addRoad={addRoad}
						totalCol={col}
						totalRow={row}
						moveCar={(carId: number, road: Road) => {
							setCar({ ...car, road });
						}}
					/>
				))}
				{zones.map((zone, i) => (
					<ConflictZoneView key={i} zone={zone} totalCol={col} totalRow={row} />
				))}
			</main>
		</DndProvider>
	);
}

export default Home;
