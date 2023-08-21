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
import connectDB from "@/server/middleware/mongodb";

export default connectSolana(
	connectDB(
		async (req: NextApiRequestWithSolanaProgram, res: NextApiResponse) => {
			const { walletAddress } = req.query;
			const { solanaConnection: connection, program } = req;

			if (!connection) {
				return res.status(500).json({ success: false });
			}

			res.writeHead(200, {
				Connection: "keep-alive",
				"Content-Encoding": "none",
				"Cache-Control": "no-cache, no-transform",
				"Content-Type": "text/event-stream",
			});

			if (walletAddress && walletAddress.length > 0) {
				let progressCount = 1;
				res.write(
					`data: ${JSON.stringify({
						message: "Progress Update",
						value: (progressCount += 1),
					})}\n\n`
				);

				res.on("close", () => {
					console.log(`close ${progressCount}`);
					res.end();
				});

				res.socket?.on("close", () => {
					console.log(`close ${progressCount}`);
					res.end();
				});
			} else {
				return res.status(400).end();
			}
		}
	)
);
