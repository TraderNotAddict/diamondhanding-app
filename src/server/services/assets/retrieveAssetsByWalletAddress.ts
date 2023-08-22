import { ASSET_LIST, Asset } from "@/utils/constants/assets";
import { JUPITER } from "@/utils/constants/endpoints";
import { BN, Program, web3 } from "@coral-xyz/anchor";
import {
	TOKEN_PROGRAM_ID,
	getAccount,
	getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import { Connection, PublicKey } from "@solana/web3.js";
import { DateTime } from "luxon";

type AccountInfo = {
	mint: string;
	owner: string;
	tokenAmount: { amount: string };
};

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

	const solBalancePromise = connection.getBalance(new PublicKey(walletAddress));
	const [solStorePubkey, _] = web3.PublicKey.findProgramAddressSync(
		[encoder.encode("sol"), new PublicKey(walletAddress).toBytes()],
		program.programId
	);
	const solStorePromise = program.account.store
		.fetch(solStorePubkey)
		.catch(() => null);
	const lockedSolBalancePromise = connection.getBalance(
		new PublicKey(solStorePubkey)
	);
	const tokenAccountsPromise = connection.getParsedTokenAccountsByOwner(
		new PublicKey(walletAddress),
		{ programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA") }
	);

	const [solBalance, solStore, lockedSolBalance, tokenAccounts] =
		await Promise.all([
			solBalancePromise,
			solStorePromise,
			lockedSolBalancePromise,
			tokenAccountsPromise,
		]);

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
	userAssets.push(userSolanaAssetInfo);

	const tokens = tokenAccounts.value
		.filter((account) => {
			const parsedData = account.account.data.parsed.info as AccountInfo;
			return ASSET_LIST.map((a) => a.mintAddress).includes(parsedData.mint);
		})
		.map((account) => {
			const parsedData = account.account.data.parsed.info as AccountInfo;
			const asset: UserAssetInfo = {
				asset: ASSET_LIST.find(
					(a) => a.mintAddress === parsedData.mint
				) as Asset,
				hasOngoingSession: false,
				walletBalance: Number(parsedData.tokenAmount.amount),
				lockedBalance: 0,
				unlockDate: undefined,
				canManuallyUnlock: false,
			};
			return asset;
		});

	const tokenPromises = tokens.map(async (token) => {
		const [splStorePubkey, _] = web3.PublicKey.findProgramAddressSync(
			[
				encoder.encode("spl"),
				new PublicKey(walletAddress).toBytes(),
				new PublicKey(token.asset.mintAddress).toBytes(),
			],
			program.programId
		);
		let splStore, tokenAccount;
		try {
			splStore = await program.account.store.fetch(splStorePubkey);
		} catch (error) {
			// no store active
		}

		const toAta = getAssociatedTokenAddressSync(
			new PublicKey(token.asset.mintAddress),
			splStorePubkey,
			true,
			TOKEN_PROGRAM_ID
		);

		try {
			tokenAccount = await getAccount(connection, toAta);
		} catch (error) {}

		token.hasOngoingSession = !!splStore;
		token.lockedBalance = Number(tokenAccount?.amount ?? 0);
		token.unlockDate = (splStore?.unlockDate as BN)?.toNumber() ?? undefined;
		token.canManuallyUnlock = splStore?.canManuallyUnlock as boolean;

		return token;
	});

	const pricesPromise = fetch(
		`${JUPITER}?ids=${[...userAssets, ...tokens]
			.map((asset) => asset.asset.mintAddress)
			.join(",")}`
	).then((res) => res.json());

	const [tokenResults, prices] = await Promise.all([
		Promise.all(tokenPromises),
		pricesPromise,
	]);

	tokenResults.forEach((token) => {
		userAssets.push(token);
	});

	userAssets.forEach((asset) => {
		asset.priceinUSDC =
			prices?.data?.[asset.asset.mintAddress]?.price ?? undefined;
	});

	return userAssets;
};
