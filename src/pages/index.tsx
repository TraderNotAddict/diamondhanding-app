import { Hero } from "@/components/Hero";
import { MementoTable } from "@/components/MementoTable";
import { Navbar } from "@/components/navbar";
import { Box, Container } from "@chakra-ui/react";
import { useWallet } from "@solana/wallet-adapter-react";
import { NextPage } from "next";
import { useEffect } from "react";
import { useJobState } from "@/store";
import Head from "next/head";
import { mutate } from "swr";
import toast from "react-hot-toast";

const Home: NextPage = () => {
	const { publicKey, signTransaction, connected } = useWallet();
	const hasJob = useJobState((state) => state.hasJob);
	const setHasJob = useJobState((state) => state.setHasJob);

	useEffect(() => {
		if (hasJob && publicKey) {
			console.log("has job");
			const buttonToastId = toast.loading(
				"Assembling your personalised memento... Check back in a minute!",
				{
					id: `buttonToast${"assemblingMemento"}`,
					position: "bottom-right",
					duration: 5000,
				}
			);
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
					toast.success("Check your mementos! Latest are on top.", {
						id: buttonToastId,
						position: "bottom-right",
					});
					mutate(`/api/memento/${publicKey}`);
					setHasJob(false);
					eventSource.close();
				}
			};

			eventSource.onerror = (e) => {
				console.log(e);
				toast.error("Your memento may be a little delayed...", {
					id: buttonToastId,
					position: "bottom-right",
				});
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
