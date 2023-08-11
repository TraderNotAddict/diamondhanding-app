import connectSolana, {
	NextApiRequestWithSolanaProgram,
} from "@/server/middleware/connectSolana";
import { Connection } from "@solana/web3.js";
import { NextApiResponse } from "next";
import { Program } from "@coral-xyz/anchor";
import { INft } from "@/models/nft";

export type MintInput = {
	mintTo: string;
	payer: string;
	nfts: INft[];
};

export default connectSolana(
	async (req: NextApiRequestWithSolanaProgram, res: NextApiResponse) => {
		if (req.method === "POST") {
			const { mintTo, payer, nfts } = req.body as MintInput;

			if (!mintTo || !payer || !nfts || nfts.length === 0) {
				return res.status(400).json({ message: "Missing required fields" });
			}

			const { solanaConnection: connection, program } = req;

			if (!connection) {
				return res.status(500).json({ success: false, userAssets: [] });
			}
		} else {
			res.status(405).json({ message: "Method not allowed" });
		}
	}
);
