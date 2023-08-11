import mongoose from "mongoose";
import type { NextApiRequest, NextApiResponse, NextApiHandler } from "next";

export const runConnectDB = async () => {
	if (!!mongoose.connections.find((c) => !!c.readyState)) {
		// Use current db connection
		console.log(
			`Connected to ${process.env.NODE_ENV} server reusing old connection...`
		);
	} else {
		try {
			await mongoose.connect(process.env.MONGODB_CONN_STRING || "", {
				minPoolSize: 11,
				w: "majority",
				socketTimeoutMS: 30000,
			});
			console.log(
				`Connected to ${process.env.NODE_ENV} server and successfully to mongodb...`
			);
		} catch (error) {
			console.log(error);
		}
	}
	return mongoose;
};

const connectDB =
	(handler: NextApiHandler) =>
	async (req: NextApiRequest, res: NextApiResponse) => {
		await runConnectDB();
		return handler(req, res);
	};

export default connectDB;
