import Head from "next/head";
import { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import CarView from "../components/CarView";
import ConflictZoneView from "../components/ConflictZoneView";
import RoadsView from "../components/RoadsView";
import useIntersection from "../hooks/useIntersection";
import Move from "../models/move";

function Home() {
	const [int, setInt] = useState<NodeJS.Timer | undefined>(undefined);
	const [isStart, setIsStart] = useState(false);
	const {
		intersection,
		cars,
		demoCar,
		moveCar,
		addRoad,
		setCarDest,
		roadCollections,
		zones,
		setCars,
		reset,
		randomIntersection,
	} = useIntersection();

	return (
		<DndProvider backend={HTML5Backend}>
			<Head>
				<title>Title</title>
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<main className='container relative min-h-screen py-5 mx-auto'>
				{intersection.selectingDestCar && (
					<div className='bg-gray-600 opacity-60 w-screen h-screen z-20 fixed top-0 left-0' />
				)}
				<CarView key={demoCar.id} car={demoCar} demo canDrag={!isStart} intersection={intersection} />
				{cars.map((car) => (
					<CarView key={car.id} car={car} canDrag={!isStart} intersection={intersection} />
				))}
				{roadCollections.map((roads, i) => (
					<RoadsView
						key={i}
						{...roads}
						addRoad={addRoad}
						moveCar={moveCar}
						setCarDest={setCarDest}
						intersection={intersection}
					/>
				))}
				{zones.map((zone, i) => (
					<ConflictZoneView key={i} zone={zone} intersection={intersection} />
				))}

				<div style={{ bottom: "100px", right: "270px" }} className='absolute flex flex-col justify-end'>
					<button
						className='btn btn-accent'
						disabled={isStart}
						onClick={() => {
							const interval = setInterval(() => {
								for (const car of cars) {
									if (!car.isEnd) {
										const move = Move.generateRandomMove();
										move.perform(car, intersection);
									}
								}
								setCars([...cars]);
							}, 200);
							setIsStart(true);
							setInt(interval);
						}}
					>
						Start
					</button>
				</div>
				<div style={{ bottom: "100px", right: "177px" }} className='absolute flex flex-col justify-end'>
					<button
						className='btn'
						disabled={!isStart}
						onClick={() => {
							if (int) clearInterval(int);
							setIsStart(false);
							reset();
						}}
					>
						Reset
					</button>
				</div>
				<div style={{ bottom: "100px", right: "60px" }} className='absolute flex flex-col justify-end'>
					<button className='btn' disabled={isStart} onClick={randomIntersection}>
						Random
					</button>
				</div>
			</main>
		</DndProvider>
	);
}

export default Home;
