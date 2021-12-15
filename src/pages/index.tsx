import Head from "next/head";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DraggableCar from "../components/DraggableCar";
import Road from "../components/DroppableRoad";

function Home() {
	return (
		<DndProvider backend={HTML5Backend}>
			<Head>
				<title>Title</title>
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<main className='container mx-auto my-5'>
				<DraggableCar/>
				<Road />
				<Road />
			</main>
		</DndProvider>
	);
}

export default Home;
