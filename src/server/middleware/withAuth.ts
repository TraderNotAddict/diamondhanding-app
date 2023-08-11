import { NextApiRequest, NextApiHandler, NextApiResponse } from "next";
import { runConnectDB } from "./mongodb";
import { getAccessToken } from "@/utils/getAccessToken";

export interface ReqWithKey extends NextApiRequest {
	key?: number[];
}

const withAuth =
	(handler: NextApiHandler) =>
	async (req: NextApiRequest, res: NextApiResponse) => {
		await runConnectDB();
		const accessToken = getAccessToken();

		const modifiedReq: ReqWithKey = req;
		if (accessToken) modifiedReq.key = JSON.parse(accessToken);
		return handler(modifiedReq, res);
	};

export default withAuth;
