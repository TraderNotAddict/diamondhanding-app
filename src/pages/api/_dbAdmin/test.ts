import connectSolana, {
	NextApiRequestWithSolanaProgram,
} from "@/server/middleware/connectSolana";
import { DebugInfo, sendErrorToDiscord } from "@/utils/sendErrorToDiscord";
import { BN, web3 } from "@coral-xyz/anchor";
import {
	Keypair,
	Transaction,
	SystemProgram,
	PublicKey,
} from "@solana/web3.js";
import { DateTime } from "luxon";
import { NextApiResponse } from "next";
import { TextEncoder } from "util";
import {
	createAssociatedTokenAccountInstruction,
	getAssociatedTokenAddressSync,
	createTransferCheckedInstruction,
	TOKEN_PROGRAM_ID,
} from "@solana/spl-token";

export type TxCreateData = {
	tx: string;
};

export default connectSolana(
	async (
		req: NextApiRequestWithSolanaProgram,
		res: NextApiResponse<TxCreateData>
	) => {
		if (req.method === "POST") {
			const { walletAddress, txnType, amount } = req.body; // for now switch between "deposit" and "withdraw" as MVP to test

			if (!req.solanaConnection || !req.program || !req.program?.programId) {
				return res.status(500).json({ tx: "" });
			}

			const connection = req.solanaConnection;
			const encoder = new TextEncoder();
			const program = req.program;

			try {
				let transaction: Transaction = new Transaction();

				const [solStorePubkey, _] = web3.PublicKey.findProgramAddressSync(
					[encoder.encode("sol"), new PublicKey(walletAddress).toBytes()],
					program.programId
				);

				let ata;

				try {
					ata = getAssociatedTokenAddressSync(
						new PublicKey("bSo13r4TkiE4KumL71LsHTPpL2euBYLFx6h9HP3piy1"),
						solStorePubkey,
						true,
						TOKEN_PROGRAM_ID
					);

					transaction.add(
						createAssociatedTokenAccountInstruction(
							new PublicKey(walletAddress),
							ata,
							solStorePubkey,
							new PublicKey("bSo13r4TkiE4KumL71LsHTPpL2euBYLFx6h9HP3piy1")
						)
					);

					// create txn
					transaction.add(
						createTransferCheckedInstruction(
							new PublicKey("6zURaQosyysh7JTBuaEkGpyxb1aMXLhLtTbbJxokEwAE"),
							new PublicKey("bSo13r4TkiE4KumL71LsHTPpL2euBYLFx6h9HP3piy1"),
							ata,
							new PublicKey(walletAddress),
							1000000000, // replace with quantity
							9
						)
					);
				} catch (error) {}

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
