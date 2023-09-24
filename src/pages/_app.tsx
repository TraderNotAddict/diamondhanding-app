import React, { useMemo } from "react";
import { Toaster } from "react-hot-toast";
import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import { ConnectionProvider } from "@solana/wallet-adapter-react";
import {
	SolflareWalletAdapter,
	LedgerWalletAdapter,
	GlowWalletAdapter,
	PhantomWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { ChakraProvider } from "@chakra-ui/react";

import ClientWalletProvider from "@/components/contexts/ClientWalletProvider";
import { NETWORK } from "@/utils/constants/endpoints";
import theme from "../styles/theme";
import "../styles/globals.scss";
import { Fonts } from "@/components/Fonts";

const ReactUIWalletModalProviderDynamic = dynamic(
	async () =>
		(await import("@solana/wallet-adapter-react-ui")).WalletModalProvider,
	{ ssr: false }
);

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
	const wallets = useMemo(
		() => [new SolflareWalletAdapter(), new LedgerWalletAdapter()],
		[]
	);

	return (
		<ConnectionProvider endpoint={NETWORK}>
			<ClientWalletProvider wallets={wallets}>
				<ReactUIWalletModalProviderDynamic>
					<ChakraProvider theme={theme}>
						<Fonts />
						<Toaster position="top-right" reverseOrder={false} />
						<Component {...pageProps} />
					</ChakraProvider>
				</ReactUIWalletModalProviderDynamic>
			</ClientWalletProvider>
		</ConnectionProvider>
	);
}

export default MyApp;
