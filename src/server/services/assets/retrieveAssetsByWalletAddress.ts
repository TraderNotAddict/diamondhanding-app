import { ASSET_LIST, Asset } from "@/utils/constants/assets";
import { JUPITER } from "@/utils/constants/endpoints";
import { BN, Program, web3 } from "@coral-xyz/anchor";
import { Connection, PublicKey } from "@solana/web3.js";
import { DateTime } from "luxon";

export type UserAssetInfo = {
	asset: Asset;
	hasOngoingSession: boolean;
	walletBalance: number;
	lockedBalance: number;
	unlockDate: number | undefined;
	canManuallyUnlock: boolean;
	priceinUSDC?: number;
};

export const retrieveAssetsByWalletAddress = async ({
	walletAddress,
	connection,
	program,
}: {
	walletAddress: string;
	connection: Connection;
	program: Program;
}) => {
	const userAssets: UserAssetInfo[] = [];

	const encoder = new TextEncoder();
	const solBalance = await connection.getBalance(new PublicKey(walletAddress));
	const [solStorePubkey, _] = web3.PublicKey.findProgramAddressSync(
		[encoder.encode("sol"), new PublicKey(walletAddress).toBytes()],
		program.programId
	);
	let solStore;
	try {
		solStore = await program.account.store.fetch(solStorePubkey);
	} catch (error) {
		// no store active
	}
	const lockedSolBalance = await connection.getBalance(
		new PublicKey(solStorePubkey)
	);
	const unlockDate = (solStore?.unlockDate as BN)?.toNumber() ?? undefined;
	const canManuallyUnlock = solStore?.canManuallyUnlock as boolean;

	const userSolanaAssetInfo: UserAssetInfo = {
		asset: ASSET_LIST.find((asset) => asset.symbol === "SOL") as Asset,
		hasOngoingSession: !!solStore,
		walletBalance: solBalance,
		lockedBalance: lockedSolBalance,
		unlockDate: unlockDate,
		canManuallyUnlock: canManuallyUnlock ?? false,
	};
	console.log({ userSolanaAssetInfo });
	userAssets.push(userSolanaAssetInfo);

	return userAssets;

	// Get all token accounts for the user
	const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
		new PublicKey(walletAddress),
		{
			programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
		}
	);

	// Filter token accounts by the mint address
	// const nftCollection = isDevNet
	// 	? tokenAccounts.value
	// 			.filter((account) => {
	// 				const parsedData = account.account.data.parsed.info as AccountInfo;
	// 				return (
	// 					mintListDev.map((m) => m.mint_account).includes(parsedData.mint) &&
	// 					parsedData.tokenAmount.amount === "1"
	// 				);
	// 			})
	// 			.map((account) => {
	// 				const parsedData = account.account.data.parsed.info as AccountInfo;
	// 				return parsedData.mint;
	// 			})
	// 	: tokenAccounts.value
	// 			.filter((account) => {
	// 				const parsedData = account.account.data.parsed.info as AccountInfo;
	// 				return (
	// 					mintList.map((m) => m.mint).includes(parsedData.mint) &&
	// 					parsedData.tokenAmount.amount === "1"
	// 				);
	// 			})
	// 			.map((account) => {
	// 				const parsedData = account.account.data.parsed.info as AccountInfo;
	// 				return parsedData.mint;
	// 			});

	// if (!nftCollection || nftCollection.length === 0) return [];

	return [];
};
