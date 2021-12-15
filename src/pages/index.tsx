import Head from "next/head";

function Home() {
	return (
		<div>
			<Head>
				<title>Title</title>
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<main className='text-5xl bg-red-200'>HELLO WORLD</main>
		</div>
	);
}

export default Home;
