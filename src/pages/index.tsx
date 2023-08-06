import { LockButton } from "@/components/lock-assets/LockButton";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { NextPage } from "next";
import Head from "next/head";

const Home: NextPage = () => {
	const { publicKey, signTransaction, connected } = useWallet();

	return (
		<>
			<div>Test</div>
			<div className="">
				<WalletMultiButton className="" />
				<LockButton />
			</div>
		</>
	);
};

export default Home;
