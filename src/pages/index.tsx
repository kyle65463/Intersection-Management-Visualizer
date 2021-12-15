import Head from "next/head";
import { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import CarView from "../components/CarView";
import RoadsView from "../components/RoadsView";
import { Road, RoadDirection } from "../models/road";

function Home() {
	const dirs: RoadDirection[] = ["left", "right", "top", "bot"];
	const [roads, setRoads] = useState(dirs.map((dir) => ({ dir, roads: [new Road(0, dir)] })));

	const [roadId, setRoadId] = useState(0);
	return (
		<DndProvider backend={HTML5Backend}>
			<Head>
				<title>Title</title>
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<main className='container mx-auto py-5 relative min-h-screen'>
				<CarView id={0} roadId={roadId} />
				{roads.map((e, i) => (
					<RoadsView
						key={i}
						{...e}
						addRoad={(road) => {
							const roadsId = roads.findIndex((e) => e.dir === road.dir);
							roads[roadsId].roads.push(road);
							setRoads([...roads]);
						}}
					/>
				))}
			</main>
		</DndProvider>
	);
}

export default Home;
