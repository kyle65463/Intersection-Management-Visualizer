import Head from "next/head";
import { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import CarView from "../components/CarView";
import RoadView from "../components/RoadView";
import { Road } from "../models/road";
import { roadHeight } from "../utils/constants";

function Home() {
	const [roads, setRoads] = useState([new Road(0)]);
	const [roadId, setRoadId] = useState(0);
	return (
		<DndProvider backend={HTML5Backend}>
			<Head>
				<title>Title</title>
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<main className='container mx-auto py-5 relative min-h-screen'>
				<CarView id={0} roadId={roadId} />
				{roads.map((road) => (
					<RoadView
						key={road.id}
						id={road.id}
						numRoads={roads.length}
						moveCar={(carId: number) => {
							setRoadId(road.id);
						}}
					></RoadView>
				))}
				<button
					className='btn'
					onClick={() => {
						setRoads([...roads, new Road(roads.length)]);
					}}
				>
					add
				</button>
			</main>
		</DndProvider>
	);
}

export default Home;
