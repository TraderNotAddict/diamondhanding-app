import connectSolana, {
	NextApiRequestWithSolanaProgram,
} from "@/server/middleware/connectSolana";
import { DebugInfo, sendErrorToDiscord } from "@/utils/sendErrorToDiscord";
import { TOKEN_PROGRAM_ID } from "@coral-xyz/anchor/dist/cjs/utils/token";
import { Keypair, Transaction, PublicKey } from "@solana/web3.js";
import { NextApiResponse } from "next";

export type TxSendData = {
	txSignature: string;
};

export default connectSolana(
	async (
		req: NextApiRequestWithSolanaProgram,
		res: NextApiResponse<TxSendData>
	) => {
		if (req.method === "POST") {
			if (!req.solanaConnection) {
				return res.status(500).json({ txSignature: "" });
			}

			const { signedTx, payer } = req.body;
			const connection = req.solanaConnection;

			try {
				const tx = Transaction.from(Buffer.from(signedTx, "base64"));

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
					errorType: "Transaction Send Error",
					message: (error as Error).message,
					route: "api/transaction/send",
					data: {
						payer,
					},
				};
				console.log(info);
				// sendErrorToDiscord(info);
				return res.status(405).json({ txSignature: "" });
			}
		} else {
			res.status(405).json({ txSignature: "" });
		}
	}
);
