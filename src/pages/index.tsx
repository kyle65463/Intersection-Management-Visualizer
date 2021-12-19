import Head from "next/head";
import { useCallback, useEffect, useRef, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import CarView from "../components/CarView";
import ConflictZoneView from "../components/ConflictZoneView";
import RoadsView from "../components/RoadsView";
import useCars from "../hooks/useCars";
import { goLeft, goRight, goStraight } from "../models/car";
import { useConflictZones } from "../models/confict_zone";
import { Road, Direction } from "../models/road";

function Home() {
	const dirs: Direction[] = ["left", "right", "top", "bot"];
	const [roadCollections, setRoads] = useState(
		dirs.map((dir) => ({ dir, roads: [new Road(0, dir), new Road(1, dir)] }))
	);
	const { zones, setSize } = useConflictZones();

	const updateRoad = useCallback(
		(road: Road) => {
			console.log(`update ${road.id} ${road.dir}`);
			const roadsId = roadCollections.findIndex((roads) => roads.dir === road.dir);
			if (!roadCollections[roadsId].roads.find((e) => e.id == road.id)) {
				// Add new road
				roadCollections[roadsId].roads.push(road);
			}
			Road.numAllRoads[road.dir] = roadCollections[roadsId].roads.length;
			setRoads([...roadCollections]);
		},
		[roadCollections]
	);

	const { cars, demoCar, moveCar } = useCars(updateRoad);

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
				<CarView key={demoCar.id} car={demoCar} demo />
				{cars.map((car) => (
					<CarView key={car.id} car={car} />
				))}
				{roadCollections.map((roads, i) => (
					<RoadsView key={i} {...roads} addRoad={updateRoad} moveCar={moveCar} />
				))}
				{zones.map((zone, i) => (
					<ConflictZoneView key={i} zone={zone} />
				))}
			</main>

			<div className='flex flex-col justify-end'>
				<button
					className='btn'
					onClick={() => {
						for (const car of cars) {
							setInterval(() => {
								if (!car.ended) {
									const p = Math.random();
									if (p > 0.5) {
										goStraight(car);
									} else if (p > 0.25) {
										goRight(car);
									} else {
										goLeft(car);
									}
									// setCars([...cars.filter((c) => c.id != car.id), car]);
								}
							}, 200);
						}
					}}
				>
					foward
				</button>
			</div>
		</DndProvider>
	);
}

export default Home;
