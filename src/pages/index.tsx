import Head from "next/head";
import { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import CarView from "../components/CarView";
import ConflictZoneView from "../components/ConflictZoneView";
import RoadsView from "../components/RoadsView";
import useCars from "../hooks/useCars";
import { goLeft, goRight, goStraight } from "../models/car";
import { ConflictZone } from "../models/confict_zone";

function Home() {
	const [int, setInt] = useState<NodeJS.Timer | undefined>(undefined);
	const [isStart, setIsStart] = useState(false);
	const { cars, demoCar, moveCar, addRoad, roadCollections, zones } = useCars();
	console.log("c");
	console.log(ConflictZone.numCols);
	console.log(ConflictZone.numRows);
	console.log(zones.length);
	return (
		<DndProvider backend={HTML5Backend}>
			<Head>
				<title>Title</title>
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<main className='container relative min-h-screen py-5 mx-auto'>
				<CarView key={demoCar.id} car={demoCar} demo canDrag={!isStart} />
				{cars.map((car) => (
					<CarView key={car.id} car={car} canDrag={!isStart} />
				))}
				{roadCollections.map((roads, i) => (
					<RoadsView key={i} {...roads} addRoad={addRoad} moveCar={moveCar} />
				))}
				{zones.map((zone, i) => (
					<ConflictZoneView key={i} zone={zone} />
				))}

				<div style={{ bottom: "100px", right: "150px" }} className='absolute flex flex-col justify-end'>
					<button
						className='btn btn-accent'
						disabled={isStart}
						onClick={() => {
							const interval = setInterval(() => {
								for (const car of cars) {
									if (!car.ended) {
										const p = Math.random();
										if (p > 0.5) {
											goStraight(car);
										} else if (p > 0.25) {
											goRight(car);
										} else {
											goLeft(car);
										}
									}
								}
								// setCars([...cars]);
							}, 200);
							setIsStart(true);
							setInt(interval);
						}}
					>
						Start
					</button>
				</div>
				<div style={{ bottom: "100px", right: "60px" }} className='absolute flex flex-col justify-end'>
					<button
						className='btn'
						onClick={() => {
							if (int) clearInterval(int);
							// resetCars();
							setIsStart(false);
						}}
					>
						Reset
					</button>
				</div>
			</main>
		</DndProvider>
	);
}

export default Home;
