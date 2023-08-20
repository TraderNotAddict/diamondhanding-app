import { Job } from "@/models/job";
import connectSolana, {
	NextApiRequestWithSolanaProgram,
} from "@/server/middleware/connectSolana";
import { Asset } from "@/utils/constants/assets";
import { DebugInfo, sendErrorToDiscord } from "@/utils/sendErrorToDiscord";
import { TOKEN_PROGRAM_ID } from "@coral-xyz/anchor/dist/cjs/utils/token";
import { Keypair, Transaction, PublicKey } from "@solana/web3.js";
import { DateTime, Duration } from "luxon";
import { NextApiResponse } from "next";

export type TxSendData = {
	txSignature: string;
	jobId: string;
};

export default connectSolana(
	async (
		req: NextApiRequestWithSolanaProgram,
		res: NextApiResponse<TxSendData>
	) => {
		if (req.method === "POST") {
			if (!req.solanaConnection) {
				return res.status(500).json({ txSignature: "", jobId: "" });
			}

			const {
				signedTx,
				payer,
				txId,
				sendType,
				shouldReceiveReward,
				asset,
			}: {
				signedTx: string;
				payer: string;
				txId: string;
				sendType: "lock" | "withdraw" | "mint";
				shouldReceiveReward: boolean;
				asset: Asset;
			} = req.body;
			const connection = req.solanaConnection;

			try {
				const tx = Transaction.from(Buffer.from(signedTx, "base64"));

				// This code need to be improved to ensure that the same signedTx is actually the same transaction as the one initiated earlier.

				// Send the transaction
				const txSignature = await connection.sendRawTransaction(
					tx.serialize({
						requireAllSignatures: true,
						verifySignatures: true,
					})
				);

				let job;
				// Update the job to reflect that the transaction has been sent out
				if (sendType === "lock") {
					job = await Job.findOneAndUpdate(
						{
							txId: txId,
							transactionSentOutAt: undefined,
						},
						{
							transactionSentOutAt: new Date(),
							txId: null,
							$inc: { __v: 1 },
						},
						{
							upsert: false,
						}
					);
				} else if (sendType === "withdraw") {
					job = await Job.findOne({
						txId: undefined, // no txId because processed
						walletAddress: payer, // payer is the walletAddress
						verifiedAt: undefined, // not yet redeemed reward
						transactionSentOutAt: { $ne: undefined }, // already sent out.
						assetLocked: asset.mintAddress, // the asset is the same as the one locked
						archivedAt: undefined, // not yet archived
					});
					if (job) {
						if (
							shouldReceiveReward &&
							job.lockedUntil &&
							DateTime.fromJSDate(job.lockedUntil).toSeconds() <=
								DateTime.utc().plus(Duration.fromMillis(30000)).toSeconds()
						) {
							job.verifiedAt = new Date();
						} else {
							job.archivedAt = new Date();
						}
						await job.save();
					}
				}

				res.status(200).json({ txSignature, jobId: job?._id ?? "" });
			} catch (error) {
				const info: DebugInfo = {
					errorType: "Transaction Send Error",
					message: (error as Error).message,
					route: "api/transaction/send",
					data: {
						payer,
					},
				};
				console.log(info);
				// sendErrorToDiscord(info);
				return res.status(405).json({ txSignature: "", jobId: "" });
			}
		} else {
			res.status(405).json({ txSignature: "", jobId: "" });
		}
	}
);
