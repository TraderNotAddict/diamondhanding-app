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
import { NftCollection } from "@/models/enums/NftCollection";
import { getCollectionMintProgress } from "@/server/services/memento/mint/getCollectionMintProgress";

export default connectSolana(
	connectDB(
		async (
			req: NextApiRequestWithSolanaProgram,
			res: NextApiResponse<{
				success: boolean;
				userMementos: IMemento[];
				mintProgresses?: { [key in NftCollection]: number };
			}>
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
				const mintProgresses = {
					[NftCollection.CCSH]: await getCollectionMintProgress(
						NftCollection.CCSH,
						connection
					),
					[NftCollection.PHBC]: await getCollectionMintProgress(
						NftCollection.PHBC,
						connection
					),
					[NftCollection.Dev1b]: 5,
					[NftCollection.Dev1c]: 0,
					[NftCollection.Dev1]: 0,
					[NftCollection.Dev2]: 0,
				};
				return res
					.status(200)
					.json({ success: true, userMementos, mintProgresses });
			}

			return res.status(400).end();
		}
	)
);
