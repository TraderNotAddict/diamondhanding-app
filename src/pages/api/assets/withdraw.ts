import connectSolana, {
	NextApiRequestWithSolanaProgram,
} from "@/server/middleware/connectSolana";
import connectDB from "@/server/middleware/mongodb";
import { Asset } from "@/utils/constants/assets";
import { DebugInfo, sendErrorToDiscord } from "@/utils/sendErrorToDiscord";
import { BN, web3 } from "@coral-xyz/anchor";
import {
	TOKEN_PROGRAM_ID,
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
					asset,
				}: { walletAddress: string; asset: Asset } = req.body; // for now switch between "deposit" and "withdraw" as MVP to test

				if (!req.solanaConnection || !req.program || !req.program?.programId) {
					return res.status(500).json({ tx: "" });
				}

				const connection = req.solanaConnection;
				const encoder = new TextEncoder();
				const program = req.program;

				try {
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
							return res.status(500).json({ tx: "" });
						}

						const withdrawAndCloseAccountInstruction = await program.methods
							.withdrawSolAndCloseAccount()
							.accounts({
								solStore: solStorePubkey,
								signer: new PublicKey(walletAddress),
							})
							.instruction();

						transaction.add(withdrawAndCloseAccountInstruction);
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

						let splStore;

						const storeAta = getAssociatedTokenAddressSync(
							new PublicKey(asset.mintAddress),
							splStorePubkey,
							true,
							TOKEN_PROGRAM_ID
						);

						const signerAta = getAssociatedTokenAddressSync(
							new PublicKey(asset.mintAddress),
							new PublicKey(walletAddress),
							false,
							TOKEN_PROGRAM_ID
						);

						try {
							splStore = await program.account.store.fetch(splStorePubkey);
						} catch (error) {
							return res.status(500).json({ tx: "" });
						}

						const withdrawAndCloseAccountInstruction = await program.methods
							.withdrawSplAndCloseAccount()
							.accounts({
								splStore: splStorePubkey,
								storeAta: storeAta,
								signerAta: signerAta,
								mint: new PublicKey(asset.mintAddress),
								signer: new PublicKey(walletAddress),
								tokenProgram: TOKEN_PROGRAM_ID,
							})
							.instruction();

						transaction.add(withdrawAndCloseAccountInstruction);
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
						route: "api/assets/withdraw",
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
