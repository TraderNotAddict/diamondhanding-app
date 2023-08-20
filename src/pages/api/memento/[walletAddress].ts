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
import { getAllMementosByWalletAddress } from "@/server/services/memento/getAllMementosByWalletAddress";
import { IMemento } from "@/models/memento";

export default connectSolana(
	async (
		req: NextApiRequestWithSolanaProgram,
		res: NextApiResponse<{ success: boolean; userMementos: IMemento[] }>
	) => {
		const { walletAddress } = req.query;
		const { solanaConnection: connection, program } = req;

		if (!connection) {
			return res.status(500).json({ success: false, userMementos: [] });
		}

		if (walletAddress && walletAddress.length > 0) {
			const userMementos = await getAllMementosByWalletAddress(
				walletAddress as string
			);
			return res.status(200).json({ success: true, userMementos });
		}

		return res.status(400).end();
	}
);
