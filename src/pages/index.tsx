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
	const { publicKey } = useWallet();
	const hasJob = useJobState((state) => state.hasJob);
	const setHasJob = useJobState((state) => state.setHasJob);

	useEffect(() => {
		if (hasJob && publicKey) {
			console.log("has job");
			const prepareMemento = async () => {
				const buttonToastId = toast.loading(
					"Assembling your personalised memento... You will be notified when it's ready.",
					{
						id: `buttonToast${"assemblingMemento"}`,
						position: "bottom-right",
						duration: 8000,
					}
				);
				const result = await fetch(`/api/memento/jobs/${publicKey}`);
				if (result.status === 200) {
					const data = await result.json();
					if (data.success) {
						toast.success("Check your mementos! Latest are on top.", {
							id: buttonToastId,
							position: "bottom-right",
							duration: 3500,
						});
						mutate(`/api/memento/${publicKey}`);
						setHasJob(false);
						return;
					}
				}

				toast.error("Your memento may be a little delayed...", {
					id: buttonToastId,
					position: "bottom-right",
				});
				setHasJob(false);
				return;
			};
			prepareMemento();
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
