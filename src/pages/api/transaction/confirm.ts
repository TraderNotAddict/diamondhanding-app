import connectSolana, {
	NextApiRequestWithSolanaProgram,
} from "@/server/middleware/connectSolana";
import { NextApiRequest, NextApiResponse } from "next";

export type TxConfirmData = {
	confirmed: boolean;
	message: string;
};
export default connectSolana(
	async (req: NextApiRequestWithSolanaProgram, res: NextApiResponse) => {
		if (req.method === "POST") {
			if (!req.solanaConnection) {
				return res.status(500).json({ error: "No connection" });
			}

			const connection = req.solanaConnection;

			const { txSignature } = req.body;

			const latestBlockhash = await connection.getLatestBlockhash("finalized");
			try {
				const confirmation = await connection.confirmTransaction({
					signature: txSignature,
					blockhash: latestBlockhash.blockhash,
					lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
				});

				if (confirmation.value.err) {
					res
						.status(200)
						.json({ confirmed: false, message: "Transaction not confirmed" });
				}

				res
					.status(200)
					.json({ confirmed: true, message: "Transaction confirmed" });
			} catch (e) {
				res
					.status(200)
					.json({ confirmed: false, message: "Transaction not confirmed" });
			}
		} else {
			res.status(405).json({ confirmed: false, message: "Method not allowed" });
		}
	}
);
