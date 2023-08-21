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
import { createMemento } from "@/server/services/memento/createMemento";
import { Job } from "@/models/job";

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

			let progressCount = 0,
				maxCount = 1;

			function updateAndRespond() {
				return res.write(
					`data: ${JSON.stringify({
						message: "Progress Update",
						percent_complete: Math.round(
							((progressCount += 1) / maxCount) * 100
						),
					})}\n\n`
				);
			}

			if (walletAddress && walletAddress.length > 0) {
				const jobs = await Job.find({
					walletAddress: walletAddress as string,
					archivedAt: undefined,
					completedAt: undefined,
				});
				if (jobs.length === 0) {
					return res.end();
				}
				maxCount = jobs.length * 6;

				for (const job of jobs) {
					const memento = await createMemento({
						job,
						updateAndRespond,
					});
				}

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
