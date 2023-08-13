import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { clusterApiUrl } from "@solana/web3.js";

export const SOLANA_MAIN = clusterApiUrl(WalletAdapterNetwork.Mainnet);
export const SOLANA_TEST = clusterApiUrl(WalletAdapterNetwork.Testnet);
export const SOLANA_DEV = clusterApiUrl(WalletAdapterNetwork.Devnet);
export const METAPLEX = "https://api.metaplex.solana.com";
export const HELIUS_MAIN_NET = `https://rpc.helius.xyz/?api-key=${process.env.HELIUS_API_KEY}`;
export const HELIUS_DEV_NET = `https://devnet.helius-rpc.com/?api-key=${process.env.HELIUS_API_KEY}`;
export const DEVNET = process.env.DEVNET_RPC;
export const MAINNET = process.env.MAINNET_RPC;
export const JUPITER = "https://price.jup.ag/v4/price";

// You can use any of the other enpoints here
export const NETWORK =
	process.env.CLUSTER === "devnet" ? HELIUS_DEV_NET : HELIUS_MAIN_NET;

export const CLUSTER = process.env.CLUSTER;
