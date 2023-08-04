import React, { useMemo } from "react";

import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import { ConnectionProvider } from "@solana/wallet-adapter-react";
import {
	SolflareWalletAdapter,
	LedgerWalletAdapter,
	GlowWalletAdapter,
	PhantomWalletAdapter,
} from "@solana/wallet-adapter-wallets";

import "../styles/globals.css";
import { Toaster } from "react-hot-toast";
import ClientWalletProvider from "@/components/contexts/ClientWalletProvider";
import { NETWORK } from "@/utils/constants/endpoints";

const ReactUIWalletModalProviderDynamic = dynamic(
	async () =>
		(await import("@solana/wallet-adapter-react-ui")).WalletModalProvider,
	{ ssr: false }
);

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
	const wallets = useMemo(
		() => [
			new PhantomWalletAdapter(),
			new GlowWalletAdapter(),
			new SolflareWalletAdapter(),
			new LedgerWalletAdapter(),
		],
		[]
	);

	return (
		<ConnectionProvider endpoint={NETWORK}>
			<ClientWalletProvider wallets={wallets}>
				<ReactUIWalletModalProviderDynamic>
					<Toaster position="top-right" reverseOrder={false} />
					<Component {...pageProps} />
				</ReactUIWalletModalProviderDynamic>
			</ClientWalletProvider>
		</ConnectionProvider>
	);
}

export default MyApp;
