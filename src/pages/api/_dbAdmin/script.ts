import connectSolana, {
	NextApiRequestWithSolanaProgram,
} from "@/server/middleware/connectSolana";
import { Connection, Keypair } from "@solana/web3.js";
import { NextApiResponse } from "next";
import { Program } from "@coral-xyz/anchor";
import { IMemento } from "@/models/memento";
import withAuth from "@/server/middleware/withAuth";
import { uploadImageToIpfsFromPath } from "@/server/services/memento/mint/metadata/image/uploadImageToIpfs";
import { getIpfsUrl } from "@/utils/getIpfsUrl";
import { mintCollectionNft } from "@/server/services/memento/mint/admin/mintCollectionNft";
import { NETWORK } from "@/utils/constants/endpoints";
import { createMerkleTree } from "@/server/services/memento/mint/admin/createMerkleTree";
import { createMemento } from "@/server/services/memento/createMemento";
import { createInstructionToMintCompressedNft } from "@/server/services/memento/mint/createInstructionToMintCompressedNft";
import { createBlurhash } from "@/utils/createBlurhash";

export default connectSolana(
	withAuth(
		async (req: NextApiRequestWithSolanaProgram, res: NextApiResponse) => {
			const { solanaConnection: connection, program } = req;
			if (!connection || !program) {
				return res.status(500).json({ success: false });
			}
			const confirmedConnection = new Connection(NETWORK, "confirmed");
			const wallet = Keypair.fromSecretKey(new Uint8Array(req.key ?? []));
			// const collection = await mintCollectionNft({
			// 	confirmedConnection,
			// 	creatorWallet: wallet,
			// });

			// const treeInfo = await createMerkleTree({
			// 	confirmedConnection,
			// 	payer: wallet,
			// 	maxDepthSizePair: { maxDepth: 15, maxBufferSize: 64 },
			// 	canopyDepth: 10,
			// });

			// const instruction = await createInstructionToMintCompressedNft({
			// 	mementoId: "64d7ca99c8a1d39d36d8420a",
			// 	creatorWallet: wallet,
			// 	payer: wallet.publicKey.toString(),
			// });

			// Create paper hand mementos
			const paperhandoptions = [
				"buy_high_sell_low.png",
				"paperhand.png",
				"lol.png",
				"ngmi.png",
			];
			for (const option of paperhandoptions) {
				const cid = await uploadImageToIpfsFromPath(
					option,
					option,
					"public/images/paperhand/"
				);
				const imageUrl = getIpfsUrl(cid, option);
				const blurhash = await createBlurhash(imageUrl);
				console.log({
					option,
					imageUrl,
					blurhash,
				});
			}

			return res.status(200).json({ success: true });
		}
	)
);
