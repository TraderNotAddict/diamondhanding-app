import { TransactionOptions, WithTransactionCallback } from "mongodb";
import { ClientSession } from "mongoose";
import { ClientSession as ClientSessionType } from "mongodb";

const runTransactionWithRetry = async (
	session: ClientSession,
	fn: WithTransactionCallback,
	options: TransactionOptions = {
		readPreference: "primary",
		readConcern: { level: "local" },
		writeConcern: { w: "majority" },
	}
) => {
	await (session as ClientSessionType).withTransaction(fn, options);
	await session.endSession();
};

export default runTransactionWithRetry;
