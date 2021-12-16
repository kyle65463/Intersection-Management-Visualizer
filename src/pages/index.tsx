import Head from "next/head";
import { useCallback, useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import CarView from "../components/CarView";
import ConflictZoneView from "../components/ConflictZoneView";
import RoadsView from "../components/RoadsView";
import { Car, goLeft, goRight, goStraight } from "../models/car";
import { ConflictZone, useConflictZones } from "../models/confict_zone";
import { Road, Direction } from "../models/road";

function Home() {
	const dirs: Direction[] = ["left", "right", "top", "bot"];
	const [roadCollections, setRoads] = useState(dirs.map((dir) => ({ dir, roads: [new Road(0, dir)] })));
	const { zones, setSize } = useConflictZones();
	const [car, setCar] = useState(new Car(0));

	const addRoad = useCallback(
		(road: Road) => {
			const roadsId = roadCollections.findIndex((roads) => roads.dir === road.dir);
			roadCollections[roadsId].roads.push(road);
			Road.numAllRoads[road.dir] = roadCollections[roadsId].roads.length;
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
		setSize({ col, row });
	}, [roadCollections]);
	return (
		<DndProvider backend={HTML5Backend}>
			<Head>
				<title>Title</title>
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<main className='container mx-auto py-5 relative min-h-screen'>
				<CarView car={car} />
				{roadCollections.map((roads, i) => (
					<RoadsView
						key={i}
						{...roads}
						addRoad={addRoad}
						moveCar={(carId: number, road: Road) => {
							if (!car.started) {
								car.setInitialRoad(road);
								setCar({ ...car });
							}
						}}
					/>
				))}
				{zones.map((zone, i) => (
					<ConflictZoneView key={i} zone={zone} />
				))}
			</main>

			<div className='flex flex-col justify-end'>
				<button
					className='btn'
					onClick={() => {
						goLeft(car);
						setCar({ ...car });
					}}
				>
					left
				</button>
				<button
					className='btn'
					onClick={() => {
						goRight(car);
						setCar({ ...car });
					}}
				>
					right
				</button>
				<button
					className='btn'
					onClick={() => {
						goStraight(car);
						setCar({ ...car });
					}}
				>
					foward
				</button>
			</div>
		</DndProvider>
	);
}

export default Home;
