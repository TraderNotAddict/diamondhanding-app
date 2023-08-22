import { Hero } from "@/components/Hero";
import { MementoTable } from "@/components/MementoTable";
import { Navbar } from "@/components/navbar";
import { Box, Container } from "@chakra-ui/react";
import { useWallet } from "@solana/wallet-adapter-react";
import { NextPage } from "next";
import { useEffect } from "react";
import { useJobState } from "@/store";
import Head from "next/head";

const Home: NextPage = () => {
	const { publicKey, signTransaction, connected } = useWallet();
	const hasJob = useJobState((state) => state.hasJob);
	const setHasJob = useJobState((state) => state.setHasJob);

	useEffect(() => {
		if (hasJob && publicKey) {
			console.log("has job");
			const eventSource = new EventSource(`/api/memento/jobs/${publicKey}`, {
				withCredentials: true,
			});
			eventSource.onopen = () => {
				console.log("open");
			};
			eventSource.onmessage = (e) => {
				const data = JSON.parse(e.data);
				console.log(data);
				if (data.percent_complete === 100) {
					console.log("done");
					eventSource.close();
				}
			};

			eventSource.onerror = (e) => {
				console.log(e);
				setHasJob(false);
			};
			return () => {
				setHasJob(false);
				eventSource.close();
			};
		}
	}, [publicKey, hasJob, setHasJob]);

	return (
		<Box as="section" height="100vh" overflowY="auto">
			<Head>
				<title className="">Diamond Handing</title>
				<meta name="Diamond Handing" content="No Greed. No Fear." />
			</Head>
			<Navbar />
			<Container maxW="7xl" px={0} overflowX="visible" mb={10}>
				<Hero />
				<MementoTable />
			</Container>
		</Box>
	);
};

export default Home;
