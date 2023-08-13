import connectSolana, {
	NextApiRequestWithSolanaProgram,
} from "@/server/middleware/connectSolana";
import connectDB from "@/server/middleware/mongodb";
import { Asset } from "@/utils/constants/assets";
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
import { NextApiResponse } from "next";
import { TextEncoder } from "util";

export type TxCreateData = {
	tx: string;
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
					unlockDate,
					canManuallyUnlock = true,
				}: {
					walletAddress: string;
					amount: number;
					asset: Asset;
					unlockDate: number;
					canManuallyUnlock: boolean;
				} = req.body;

				if (!req.solanaConnection || !req.program || !req.program?.programId) {
					return res.status(500).json({ tx: "" });
				}

				const bufferTimeInSeconds = 30;
				const connection = req.solanaConnection;
				const encoder = new TextEncoder();
				const program = req.program;

				try {
					let transaction: Transaction = new Transaction();
					console.log({ asset });

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
								return res.status(500).json({ tx: "" });
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
							return res.status(500).json({ tx: "" });
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
								return res.status(500).json({ tx: "" });
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
								return res.status(500).json({ tx: "" });
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
							return res.status(500).json({ tx: "" });
						}
						transaction.add(depositInstruction);
					} else {
						return res.status(500).json({ tx: "" });
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

					return res.status(200).json({
						tx: transactionBase64,
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
					return res.status(500).json({ tx: "" });
				}
			} else {
				res.status(405).json({ tx: "" });
			}
		}
	)
);
