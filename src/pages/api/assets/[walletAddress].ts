import connectSolana, {
	NextApiRequestWithSolanaProgram,
} from "@/server/middleware/connectSolana";
import { NETWORK } from "@/utils/constants/endpoints";
import { Connection } from "@solana/web3.js";
import { NextApiResponse } from "next";
import {
	UserAssetInfo,
	retrieveAssetsByWalletAddress,
} from "@/server/services/assets/retrieveAssetsByWalletAddress";
import { Program } from "@coral-xyz/anchor";

export default connectSolana(
	async (
		req: NextApiRequestWithSolanaProgram,
		res: NextApiResponse<{ success: boolean; userAssets: UserAssetInfo[] }>
	) => {
		const { walletAddress } = req.query;
		const { solanaConnection: connection, program } = req;

		if (!connection) {
			return res.status(500).json({ success: false, userAssets: [] });
		}

		if (walletAddress && walletAddress.length > 0) {
			const userAssets = await retrieveAssetsByWalletAddress({
				walletAddress: walletAddress as string,
				connection: connection as Connection,
				program: program as Program,
			});
			return res.status(200).json({ success: true, userAssets });
		}

		return res.status(400).end();
	}
);
