import Head from "next/head";

function Home() {
	return (
		<div>
			<Head>
				<title>Title</title>
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<main className='container mx-auto my-5'>
				<h1 className='text-5xl bg-red-200 p-5'>HELLO WORLD</h1>
			</main>
		</div>
	);
}

export default Home;
