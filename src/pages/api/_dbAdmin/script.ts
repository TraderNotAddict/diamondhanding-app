import connectSolana, {
	NextApiRequestWithSolanaProgram,
} from "@/server/middleware/connectSolana";
import { Connection, Keypair } from "@solana/web3.js";
import { NextApiResponse } from "next";
import { Program } from "@coral-xyz/anchor";
import { INft } from "@/models/nft";
import withAuth from "@/server/middleware/withAuth";
import { uploadImageToIpfsFromPath } from "@/server/services/mint/metadata/image/uploadImageToIpfs";
import { getIpfsUrl } from "@/utils/getIpfsUrl";

export default connectSolana(
	withAuth(
		async (req: NextApiRequestWithSolanaProgram, res: NextApiResponse) => {
			const { solanaConnection: connection, program } = req;
			if (!connection || !program) {
				return res.status(500).json({ success: false });
			}
			const wallet = Keypair.fromSecretKey(new Uint8Array(req.key ?? []));
			const cid = await uploadImageToIpfsFromPath("portal_1.png");
			const url = getIpfsUrl(cid, "portal_1.png");
			return res.status(200).json({ success: true, url });
		}
	)
);
