import { useWallet } from "@solana/wallet-adapter-react";
import { NextPage } from "next";
import Head from "next/head";

const Home: NextPage = () => {
	const { publicKey, signTransaction, connected } = useWallet();

	return (
		<>
			<div>Test</div>
		</>
	);
};

export default Home;
