import Head from "next/head";
import { useState } from "react";
import { useDragLayer } from "react-dnd";
import Xarrow from "react-xarrows";
import { getTimeMap } from "../alg/alg";
import CarView from "../components/CarView";
import ConflictZoneView from "../components/ConflictZoneView";
import DemoCarView from "../components/DemoCarView";
import RoadsView from "../components/RoadsView";
import useIntersection from "../hooks/useIntersection";
import Move from "../models/move";
import { arrowAnchorOffset, arrowGridBreak, colorMapper } from "../utils/arrow_utils";

function Home() {
	const [int, setInt] = useState<NodeJS.Timer | undefined>(undefined);
	const [isStart, setIsStart] = useState(false);
	const {
		intersection,
		cars,
		demoCar,
		showInitialHint,
		moveCar,
		addRoad,
		setCarDest,
		setPreviewingCar,
		setSelectingDestCar,
		roadCollections,
		zones,
		setCars,
		reset,
		clear,
		randomIntersection,
	} = useIntersection();

	const isDragging = useDragLayer((monitor) => monitor.isDragging());

	return (
		<>
			<Head>
				<title>Intersection Management</title>
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<main
				onClick={(event) => {
					if (event.target === event.currentTarget) setPreviewingCar(undefined);
				}}
				className='container relative min-h-screen py-5 mx-auto'
			>
				{(intersection.selectingDestCar || isDragging) && (
					<div className='fixed top-0 left-0 z-20 w-screen h-screen bg-gray-600 opacity-60' />
				)}
				<DemoCarView
					key={demoCar.id}
					car={demoCar}
					canDrag={!isStart}
					intersection={intersection}
					showHint={showInitialHint}
				/>
				{cars.map((car) => (
					<>
						<CarView
							key={car.id}
							car={car}
							canDrag={!isStart}
							intersection={intersection}
							setPreviewingCar={setPreviewingCar}
							setSelectingDestCar={setSelectingDestCar}
						/>
						{!isStart &&
							!intersection.selectingDestCar &&
							intersection.previewingDestCar &&
							car == intersection.previewingDestCar &&
							car.destRoad && (
								<Xarrow
									zIndex={15}
									path='grid'
									strokeWidth={2.2}
									headSize={3.8}
									headShape='circle'
									color={colorMapper(car.color)}
									gridBreak={arrowGridBreak(intersection, car.initialRoad.dir, car.destRoad.dir)}
									startAnchor={{
										position: "auto",
										offset: arrowAnchorOffset(car.initialRoad.dir, "start"),
									}}
									endAnchor={{ position: "auto", offset: arrowAnchorOffset(car.destRoad.dir, "end") }}
									start={`road-${car.initialRoad.dir}-${car.initialRoad.id}`}
									end={`road-${car.destRoad.dir}-${car.destRoad.id}`}
								/>
							)}
						{!isStart && car.destRoad && (
							<Xarrow
								zIndex={10}
								strokeWidth={2.2}
								showTail={false}
								headSize={3.8}
								headShape='circle'
								color='transparent'
								headColor={colorMapper(car.color)}
								gridBreak={arrowGridBreak(intersection, car.initialRoad.dir, car.destRoad.dir)}
								startAnchor={{
									position: "auto",
									offset: arrowAnchorOffset(car.initialRoad.dir, "start"),
								}}
								endAnchor={{ position: "auto", offset: arrowAnchorOffset(car.destRoad.dir, "end") }}
								start={`road-${car.initialRoad.dir}-${car.initialRoad.id}`}
								end={`road-${car.destRoad.dir}-${car.destRoad.id}`}
							/>
						)}
					</>
				))}

				{roadCollections.map((roads, i) => (
					<RoadsView
						key={i}
						{...roads}
						isDragging={isDragging}
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
						className='btn btn-success'
						disabled={isStart}
						onClick={() => {
							console.log(
								intersection.cars.map((car) => ({
									id: car.id,
									roadDir: car.initialRoad.dir,
									roadId: car.initialRoad.id,
									idOnRoad: car.idOnRoad - 1,
									zones: car.route,
									outroadDir: car.destRoad?.dir ?? "right",
								}))
							);
							const map = getTimeMap(
								intersection.cars.map((car) => ({
									id: car.id,
									roadDir: car.initialRoad.dir,
									roadId: car.initialRoad.id,
									idOnRoad: car.idOnRoad - 1,
									zones: car.route,
									outroadDir: car.destRoad?.dir ?? "right",
								})),
								intersection.zonesSize.numCol,
								intersection.zonesSize.numRow
							);
							let i = 0;
							const interval = setInterval(() => {
								for (const car of cars) {
									if (!car.isEnd) {
										// @ts-ignore
										const actions = map.get(car.id);
										if (actions && actions.length > i) {
											const move = Move.from(actions[i]);
											move.perform(car, intersection);
										}
									}
								}
								setCars([...cars]);
								i++;
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
						className='btn btn-warning'
						onClick={() => {
							if (isStart) {
								if (int) clearInterval(int);
								setIsStart(false);
								reset();
							} else {
								clear();
							}
						}}
					>
						{isStart ? "Reset" : "Clear"}
					</button>
				</div>
				<div style={{ bottom: "100px", right: "60px" }} className='absolute flex flex-col justify-end'>
					<button className='btn' disabled={isStart} onClick={randomIntersection}>
						Random
					</button>
				</div>
			</main>
		</>
	);
}

export default Home;
