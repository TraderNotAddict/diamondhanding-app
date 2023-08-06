import connectSolana, {
	NextApiRequestWithSolanaProgram,
} from "@/server/middleware/connectSolana";
import { DebugInfo, sendErrorToDiscord } from "@/utils/sendErrorToDiscord";
import { web3 } from "@coral-xyz/anchor";
import {
	Keypair,
	Transaction,
	SystemProgram,
	PublicKey,
} from "@solana/web3.js";
import { NextApiResponse } from "next";
import { TextEncoder } from "util";

export type TxCreateData = {
	tx: string;
};

export default connectSolana(
	async (
		req: NextApiRequestWithSolanaProgram,
		res: NextApiResponse<TxCreateData>
	) => {
		if (req.method === "POST") {
			const { walletAddress } = req.body;

			if (!req.solanaConnection || !req.program?.programId) {
				return res.status(500).json({ tx: "" });
			}

			const connection = req.solanaConnection;
			const encoder = new TextEncoder();

			try {
				let transaction: Transaction = new Transaction();

				const [counterPubkey, _] = web3.PublicKey.findProgramAddressSync(
					[encoder.encode("counter"), new PublicKey(walletAddress).toBytes()],
					req.program?.programId
				);
				const instruction = await req.program?.methods
					.initializeCounter()
					.accounts({
						counter: counterPubkey,
						signer: new PublicKey(walletAddress),
						systemProgram: SystemProgram.programId,
					})
					.instruction();

				if (!instruction) {
					return res.status(500).json({ tx: "" });
				}

				transaction.add(instruction);

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
					route: "api/transaction/create.ts",
					data: {
						walletAddress,
					},
				};
				console.log(info);
				// sendErrorToDiscord(info);
				return res.status(500).json({ tx: "" });
			}
		} else {
			res.status(405).json({ tx: "" });
		}
	}
);
