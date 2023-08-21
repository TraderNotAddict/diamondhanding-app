import { Hero } from "@/components/Hero";
import { LockCarousel } from "@/components/LockCarousel";
import { MementoTable } from "@/components/MementoTable";
import { WithdrawButton } from "@/components/lock-assets/WithdrawButton";
import { MintButton } from "@/components/memento/MintButton";
import { Navbar } from "@/components/navbar";
import { useJobState } from "@/store";
import { Box, Container } from "@chakra-ui/react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { NextPage } from "next";
import { useEffect } from "react";

const Home: NextPage = () => {
	const { publicKey, signTransaction, connected } = useWallet();
	const hasJob = useJobState((state) => state.hasJob);
	const setHasJob = useJobState((state) => state.setHasJob);

	useEffect(() => {
		if (hasJob && publicKey) {
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
			<Navbar />
			<Container maxW="7xl" px={0} overflowX="visible">
				<Hero />
				<MementoTable />
			</Container>
			<div>
				<WithdrawButton />
			</div>
			<div>
				<MintButton />
			</div>
		</Box>
	);
};

export default Home;
