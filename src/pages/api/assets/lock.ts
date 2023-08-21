import { NftCollection } from "@/models/enums/NftCollection";
import { Job } from "@/models/job";
import { Memento } from "@/models/memento";
import runTransactionWithRetry from "@/server/integrations/transactions/runTransactionWithRetry";
import startMongooseSession from "@/server/integrations/transactions/startSession";
import connectSolana, {
	NextApiRequestWithSolanaProgram,
} from "@/server/middleware/connectSolana";
import connectDB from "@/server/middleware/mongodb";
import { getCollectionMintProgress } from "@/server/services/memento/mint/getCollectionMintProgress";
import { Asset } from "@/utils/constants/assets";
import { JUPITER } from "@/utils/constants/endpoints";
import { getInitiativeRankFromNumberMinted } from "@/utils/getInitiativeRankFromNumberMinted";
import { DebugInfo, sendErrorToDiscord } from "@/utils/sendErrorToDiscord";
import { BN, web3 } from "@coral-xyz/anchor";
import {
	ASSOCIATED_TOKEN_PROGRAM_ID,
	TOKEN_PROGRAM_ID,
	getAccount,
	getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import {
	Keypair,
	Transaction,
	SystemProgram,
	PublicKey,
} from "@solana/web3.js";
import { DateTime } from "luxon";
import { nanoid } from "nanoid";
import { NextApiResponse } from "next";
import { TextEncoder } from "util";

export type TxCreateData = {
	tx: string;
	txId: string;
};

export default connectSolana(
	connectDB(
		async (
			req: NextApiRequestWithSolanaProgram,
			res: NextApiResponse<TxCreateData>
		) => {
			if (req.method === "POST") {
				const {
					walletAddress,
					amount,
					asset,
					assetPrice = (
						await fetch(`${JUPITER}?ids=${asset.mintAddress}`).then((res) =>
							res.json()
						)
					)?.data?.[asset.mintAddress]?.price ?? 0,
					unlockDate,
					canManuallyUnlock = true,
				}: {
					walletAddress: string;
					amount: number;
					assetPrice: number;
					asset: Asset;
					unlockDate: number;
					canManuallyUnlock: boolean;
				} = req.body;

				if (!req.solanaConnection || !req.program || !req.program?.programId) {
					return res.status(500).json({ tx: "", txId: "" });
				}

				const lockDurationInSeconds = unlockDate - DateTime.utc().toSeconds();

				if (
					lockDurationInSeconds < 0 ||
					!assetPrice ||
					!amount ||
					amount < 0 ||
					!walletAddress
				) {
					return res.status(400).json({ tx: "", txId: "" });
				}

				const bufferTimeInSeconds = 30;
				const connection = req.solanaConnection;
				const encoder = new TextEncoder();
				const program = req.program;

				const session = await startMongooseSession();
				const txId = nanoid();

				try {
					await runTransactionWithRetry(session, async () => {
						let transaction: Transaction = new Transaction();

						if (asset.type === "native_token") {
							const [solStorePubkey, _] = web3.PublicKey.findProgramAddressSync(
								[encoder.encode("sol"), new PublicKey(walletAddress).toBytes()],
								program.programId
							);

							console.log(solStorePubkey);

							let solStore;
							try {
								solStore = await program.account.store.fetch(solStorePubkey);
							} catch (error) {
								console.log("Attempting to create new account...");
								const instruction = await program.methods
									.initSolStore(
										new BN(unlockDate - bufferTimeInSeconds),
										canManuallyUnlock
									)
									.accounts({
										solStore: solStorePubkey,
										signer: new PublicKey(walletAddress),
										systemProgram: SystemProgram.programId,
									})
									.instruction();

								if (!instruction) {
									return res.status(500).json({ tx: "", txId: "" });
								}
								transaction.add(instruction);
							}

							const depositInstruction = await program.methods
								.depositSol(new BN(amount * 10 ** asset.decimals))
								.accounts({
									solStore: solStorePubkey,
									systemProgram: SystemProgram.programId,
									signer: new PublicKey(walletAddress),
								})
								.instruction();

							if (!depositInstruction) {
								return res.status(500).json({ tx: "", txId: "" });
							}

							transaction.add(depositInstruction);
						} else if (asset.type === "solana_program_library_token") {
							const [splStorePubkey, _] = web3.PublicKey.findProgramAddressSync(
								[
									encoder.encode("spl"),
									new PublicKey(walletAddress).toBytes(),
									new PublicKey(asset.mintAddress).toBytes(),
								],
								program.programId
							);

							console.log(splStorePubkey);
							let splStore, tokenAccount;
							const toAta = getAssociatedTokenAddressSync(
								new PublicKey(asset.mintAddress),
								splStorePubkey,
								true,
								TOKEN_PROGRAM_ID
							);

							const fromAta = getAssociatedTokenAddressSync(
								new PublicKey(asset.mintAddress),
								new PublicKey(walletAddress),
								false,
								TOKEN_PROGRAM_ID
							);

							try {
								splStore = await program.account.store.fetch(splStorePubkey);
							} catch (error) {
								console.log("Attempting to create new SPL Store account...");
								const instruction = await program.methods
									.initSplStore(
										new BN(unlockDate - bufferTimeInSeconds),
										canManuallyUnlock
									)
									.accounts({
										splStore: splStorePubkey,
										signer: new PublicKey(walletAddress),
										mint: new PublicKey(asset.mintAddress),
										systemProgram: SystemProgram.programId,
									})
									.instruction();

								if (!instruction) {
									return res.status(500).json({ tx: "", txId: "" });
								}
								transaction.add(instruction);
							}

							try {
								tokenAccount = await getAccount(connection, toAta);
							} catch (error) {
								console.log("Attempting to create new ATA account...");
								const instruction = await program.methods
									.initAssociatedTokenAccount()
									.accounts({
										splStore: splStorePubkey,
										token: toAta,
										signer: new PublicKey(walletAddress),
										mint: new PublicKey(asset.mintAddress),
										tokenProgram: TOKEN_PROGRAM_ID,
										associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
										systemProgram: SystemProgram.programId,
									})
									.instruction();

								if (!instruction) {
									return res.status(500).json({ tx: "", txId: "" });
								}
								transaction.add(instruction);
							}

							const depositInstruction = await program.methods
								.depositSplToken(new BN(amount * 10 ** asset.decimals))
								.accounts({
									splStore: splStorePubkey,
									toAta: toAta,
									signer: new PublicKey(walletAddress),
									fromAta: fromAta,
									mint: new PublicKey(asset.mintAddress),
									tokenProgram: TOKEN_PROGRAM_ID,
								})
								.instruction();

							if (!depositInstruction) {
								return res.status(500).json({ tx: "", txId: "" });
							}
							transaction.add(depositInstruction);
						} else {
							return res.status(500).json({ tx: "", txId: "" });
						}

						const blockHash = (await connection.getLatestBlockhash("finalized"))
							.blockhash;
						transaction.feePayer = new PublicKey(walletAddress);
						transaction.recentBlockhash = blockHash;

						const ids = [];

						const serializedTransaction = transaction.serialize({
							requireAllSignatures: false, // only partially signed
							verifySignatures: true,
						});
						const transactionBase64 = serializedTransaction.toString("base64");

						const collectionName =
							process.env.CLUSTER === "devnet"
								? NftCollection.Dev1b
								: NftCollection.CC;
						const collectionMintProgress = await Memento.find(
							{
								collection: collectionName,
								mintAddress: { $ne: undefined },
								mintedAt: { $ne: undefined },
							},
							{
								_id: 1,
							},
							{
								session,
							}
						)
							.lean()
							.session(session);

						const didMeetGoal = !canManuallyUnlock && lockDurationInSeconds > 0;

						const job = new Job({
							txId,
							assetLocked: asset.mintAddress,
							quantityLocked: amount,
							nftCollection: collectionName,
							valueLockedInUSD: Math.ceil(assetPrice * amount * 100) / 100,
							durationLockedInSeconds: lockDurationInSeconds,
							walletAddress: walletAddress,
							verifiedAt: didMeetGoal ? new Date() : undefined,
							didMeetGoal,
							initiativeRank: getInitiativeRankFromNumberMinted({
								numberMinted: (collectionMintProgress?.length ?? 0) + 1,
								nftCollection: collectionName,
							}),
							lockedUntil: DateTime.fromMillis(unlockDate * 1000)
								.toUTC()
								.toJSDate(),
						});
						job.$session(session);
						await job.save();

						return res.status(200).json({
							tx: transactionBase64,
							txId,
						});
					});
				} catch (error: any) {
					const info: DebugInfo = {
						errorType: "Transaction Create Error",
						message: (error as Error).message,
						route: "api/assets/lock",
						data: {
							walletAddress,
						},
					};
					console.log(info);
					sendErrorToDiscord(info);
					return res.status(500).json({ tx: "", txId: "" });
				}
			} else {
				res.status(405).json({ tx: "", txId: "" });
			}
		}
	)
);
