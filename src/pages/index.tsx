import { Hero } from "@/components/Hero";
import { LockButton } from "@/components/lock-assets/LockButton";
import { WithdrawButton } from "@/components/lock-assets/WithdrawButton";
import { Navbar } from "@/components/navbar";
import { Box, Container } from "@chakra-ui/react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { NextPage } from "next";

const Home: NextPage = () => {
	const { publicKey, signTransaction, connected } = useWallet();

	return (
		<Box as="section" height="100vh" overflowY="auto">
			<Navbar />
			<Container maxW="7xl" px={0} overflowX="visible">
				<Hero />
			</Container>
			<div>
				<LockButton />
			</div>
			<div>
				<WithdrawButton />
			</div>
		</Box>
	);
};

export default Home;
