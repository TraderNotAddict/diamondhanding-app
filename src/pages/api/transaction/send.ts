import { Job } from "@/models/job";
import connectSolana, {
	NextApiRequestWithSolanaProgram,
} from "@/server/middleware/connectSolana";
import { DebugInfo, sendErrorToDiscord } from "@/utils/sendErrorToDiscord";
import { TOKEN_PROGRAM_ID } from "@coral-xyz/anchor/dist/cjs/utils/token";
import { Keypair, Transaction, PublicKey } from "@solana/web3.js";
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

			const { signedTx, payer, txId } = req.body;
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

				const job = await Job.findOneAndUpdate(
					{
						txId: txId,
						verifiedAt: undefined,
					},
					{
						verifiedAt: new Date(),
						txId: null,
						$inc: { __v: 1 },
					},
					{
						upsert: false,
					}
				);

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
