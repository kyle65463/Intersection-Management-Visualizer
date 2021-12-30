import type { AppProps } from "next/app";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<div className='bg-base-200'>
			<DndProvider backend={HTML5Backend}>
				<Component {...pageProps} />
			</DndProvider>
		</div>
	);
}

export default MyApp;
