import connectSolana, {
	NextApiRequestWithSolanaProgram,
} from "@/server/middleware/connectSolana";
import { Connection, Keypair, PublicKey, Transaction } from "@solana/web3.js";
import { NextApiResponse } from "next";
import { Program } from "@coral-xyz/anchor";
import { IMemento } from "@/models/memento";
import withAuth from "@/server/middleware/withAuth";
import { createInstructionToMintCompressedNft } from "@/server/services/memento/mint/createInstructionToMintCompressedNft";
import { createInstructionToSendSol } from "@/server/services/memento/mint/createInstructionToSendSol";
import { DebugInfo, sendErrorToDiscord } from "@/utils/sendErrorToDiscord";

export type MintInput = {
	payer: string;
	amountToDonateInSol?: number;
	mementoIds?: string[];
	step: "Create" | "Send";
	signedTx?: any;
};

export default connectSolana(
	withAuth(
		async (req: NextApiRequestWithSolanaProgram, res: NextApiResponse) => {
			if (req.method === "POST") {
				const { payer, amountToDonateInSol, mementoIds, step, signedTx } =
					req.body as MintInput;

				const { solanaConnection: connection, program } = req;

				if (!connection || !program) {
					return res.status(500).json({ success: false });
				}
				const wallet = Keypair.fromSecretKey(new Uint8Array(req.key ?? []));

				if (step === "Create") {
					if (!payer || !mementoIds || mementoIds.length === 0) {
						return res.status(400).json({ message: "Missing required fields" });
					}

					let transaction: Transaction = new Transaction();

					try {
						if (amountToDonateInSol && amountToDonateInSol > 0) {
							const solTransferInstruction = createInstructionToSendSol({
								amountInSol: amountToDonateInSol,
								payer: new PublicKey(payer),
								receiver: wallet.publicKey,
							});
							transaction.add(solTransferInstruction);
						}
						for (const id of mementoIds) {
							const mintInstruction =
								await createInstructionToMintCompressedNft({
									mementoId: id,
									creatorWallet: wallet,
									payer: payer,
								});
							transaction.add(mintInstruction);
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

						console.log("tx:", tx);
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
				}
			} else {
				res.status(405).json({ message: "Method not allowed" });
			}
		}
	)
);
