import Head from "next/head";
import { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import CarView from "../components/CarView";
import RoadView from "../components/RoadView";
import { Road } from "../models/road";

function Home() {
	const roads = [new Road(0), new Road(1), new Road(2)];
	const [roadId, setRoadId] = useState(0);
	return (
		<DndProvider backend={HTML5Backend}>
			<Head>
				<title>Title</title>
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<main className='container mx-auto my-5 relative'>
				<CarView id={0} roadId={roadId} />
				{roads.map((road) => (
					<RoadView
						id={road.id}
						key={road.id}
						moveCar={(carId: number) => {
							setRoadId(road.id);
						}}
					></RoadView>
				))}
			</main>
		</DndProvider>
	);
}

export default Home;
