import connectSolana, {
	NextApiRequestWithSolanaProgram,
} from "@/server/middleware/connectSolana";
import { Connection, Keypair, PublicKey, Transaction } from "@solana/web3.js";
import { NextApiResponse } from "next";
import { BN, Program } from "@coral-xyz/anchor";
import { IMemento } from "@/models/memento";
import withAuth from "@/server/middleware/withAuth";
import { createInstructionToMintCompressedNft } from "@/server/services/memento/mint/createInstructionToMintCompressedNft";
import { createInstructionToSendSol } from "@/server/services/memento/mint/createInstructionToSendSol";
import { DebugInfo, sendErrorToDiscord } from "@/utils/sendErrorToDiscord";
import { getAllChangeLogEventV1FromTransaction } from "@/utils/getAllChangeLogEventV1FromTransaction";
import { getLeafAssetId } from "@metaplex-foundation/mpl-bubblegum";
import { NETWORK } from "@/utils/constants/endpoints";

export type MintInput = {
	payer: string;
	amountToDonateInSol?: number;
	mementoId?: string;
	step: "Create" | "Send";
	signedTx?: any;
};

export default connectSolana(
	withAuth(
		async (req: NextApiRequestWithSolanaProgram, res: NextApiResponse) => {
			if (req.method === "POST") {
				const { payer, amountToDonateInSol, mementoId, step, signedTx } =
					req.body as MintInput;

				const { solanaConnection: connection, program } = req;

				if (!connection || !program) {
					return res.status(500).json({ success: false });
				}
				const wallet = Keypair.fromSecretKey(new Uint8Array(req.key ?? []));

				if (step === "Create") {
					if (!payer || !mementoId) {
						return res.status(400).json({ message: "Missing required fields" });
					}

					let transaction: Transaction = new Transaction();

					try {
						const mintInstruction = await createInstructionToMintCompressedNft({
							mementoId: mementoId,
							creatorWallet: wallet,
							payer: payer,
						});
						transaction.add(mintInstruction);

						if (amountToDonateInSol && amountToDonateInSol > 0) {
							const solTransferInstruction = createInstructionToSendSol({
								amountInSol: amountToDonateInSol,
								payer: new PublicKey(payer),
								receiver: wallet.publicKey,
							});
							transaction.add(solTransferInstruction);
						}
						const blockHash = (await connection.getLatestBlockhash("finalized"))
							.blockhash;
						transaction.feePayer = new PublicKey(payer);
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
					} catch (error) {
						const info: DebugInfo = {
							errorType: "Mint Transaction Create Error",
							message: (error as Error).message,
							route: "api/memento/mint.ts",
							data: {
								payer,
							},
						};
						console.log(info);
						sendErrorToDiscord(info);
						return res.status(500).json({ tx: "" });
					}
				} else if (step === "Send") {
					if (!payer || !signedTx) {
						return res.status(400).json({ message: "Missing required fields" });
					}

					try {
						const tx = Transaction.from(Buffer.from(signedTx, "base64"));

						//TODO insert code to check tx

						//TODO insert code to modify mongodb records of memento

						tx.partialSign(wallet);

						// Send the transaction
						const txSignature = await connection.sendRawTransaction(
							tx.serialize({
								requireAllSignatures: true,
								verifySignatures: true,
							})
						);

						res.status(200).json({ txSignature });
					} catch (error) {
						const info: DebugInfo = {
							errorType: "Mint Transaction Send Error",
							message: (error as Error).message,
							route: "api/mint",
							data: {
								payer,
							},
						};
						console.log(info);
						sendErrorToDiscord(info);
						return res.status(405).json({ txSignature: "" });
					}
				} else if (step === "Confirm") {
					const { txSignature } = req.body;
					const specialConnection = new Connection(NETWORK, "confirmed");

					const latestBlockhash = await specialConnection.getLatestBlockhash(
						"finalized"
					);
					try {
						const confirmation = await specialConnection.confirmTransaction({
							signature: txSignature,
							blockhash: latestBlockhash.blockhash,
							lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
						});

						if (confirmation.value.err) {
							res.status(200).json({
								confirmed: false,
								message: "Transaction not confirmed",
							});
						}

						const tx = await specialConnection.getTransaction(txSignature, {
							maxSupportedTransactionVersion: 0,
						});

						if (!tx) throw Error("Transaction not found");

						const events = getAllChangeLogEventV1FromTransaction(tx);

						const leafIndex = events[0].index;

						const assetId = await getLeafAssetId(
							events[0].treeId,
							new BN(events[0].index)
						);

						console.log("assetId:", assetId);

						res
							.status(200)
							.json({ confirmed: true, message: "Transaction confirmed" });
					} catch (e) {
						res
							.status(200)
							.json({ confirmed: false, message: "Transaction not confirmed" });
					}
				}
			} else {
				res.status(405).json({ message: "Method not allowed" });
			}
		}
	)
);
