import { ClientSession } from "mongoose";
import { runConnectDB } from "../../middleware/mongodb";

const startMongooseSession = async (): Promise<ClientSession> => {
	const db = await runConnectDB();
	const session = await db.startSession();
	return session;
};

export default startMongooseSession;
