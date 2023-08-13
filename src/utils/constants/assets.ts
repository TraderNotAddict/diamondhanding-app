export type Asset = {
	name: string;
	symbol: string;
	decimals: number;
	mintAddress: string;
	icon: string;
	type:
		| "native_token"
		| "solana_program_library_token"
		| "nft"
		| "sft"
		| "compressed_nft"
		| "programmable_nft";
	// Optional
	description?: string;
	website?: string;
	tags?: string[];
};

export const ASSET_LIST: Asset[] = [
	{
		name: "Solana",
		symbol: "SOL",
		decimals: 9,
		mintAddress: "So11111111111111111111111111111111111111112",
		icon: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
		type: "native_token",
	},
	{
		name: "BlazeStake Staked SOL (bSOL)",
		symbol: "bSOL",
		decimals: 9,
		mintAddress: "bSo13r4TkiE4KumL71LsHTPpL2euBYLFx6h9HP3piy1",
		icon: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/bSo13r4TkiE4KumL71LsHTPpL2euBYLFx6h9HP3piy1/logo.png",
		type: "solana_program_library_token",
	},
	{
		name: "Marinade staked SOL (mSOL)",
		symbol: "mSOL",
		decimals: 9,
		mintAddress: "mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So",
		icon: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So/logo.png",
		type: "solana_program_library_token",
	},
	{
		name: "USD Coin",
		symbol: "USDC",
		decimals: 6,
		mintAddress: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
		icon: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png",
		type: "solana_program_library_token",
	},
	{
		name: "USDT",
		symbol: "USDT",
		decimals: 6,
		mintAddress: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
		icon: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB/logo.svg",
		type: "solana_program_library_token",
	},
];
