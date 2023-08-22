import connectSolana, {
	NextApiRequestWithSolanaProgram,
} from "@/server/middleware/connectSolana";
import { NextApiResponse } from "next";
import connectDB from "@/server/middleware/mongodb";
import { createMemento } from "@/server/services/memento/createMemento";
import { Job } from "@/models/job";
import startMongooseSession from "@/server/integrations/transactions/startSession";
import runTransactionWithRetry from "@/server/integrations/transactions/runTransactionWithRetry";

export default connectSolana(
	connectDB(
		async (req: NextApiRequestWithSolanaProgram, res: NextApiResponse) => {
			const { walletAddress } = req.query;
			const { solanaConnection: connection, program } = req;

			if (!connection) {
				return res.status(500).json({ success: false });
			}

			if (walletAddress && walletAddress.length > 0) {
				while (true) {
					const session = await startMongooseSession();
					try {
						await runTransactionWithRetry(session, async () => {
							const job = await Job.findOne(
								{
									walletAddress: walletAddress as string,
									archivedAt: undefined,
									completedAt: undefined,
									didMeetGoal: { $ne: undefined },
									transactionSentOutAt: { $ne: undefined },
								},
								{},
								{ session }
							).session(session);

							if (!job) {
								throw new Error("Job not found");
							}

							await createMemento({
								job,
							});
							job.completedAt = new Date();
							await job.save();
						});
					} catch (error) {
						break;
					}
				}
				return res.status(200).json({ success: true });
			} else {
				return res.status(400).json({ success: false });
			}
		}
	)
);
