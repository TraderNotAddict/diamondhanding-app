import { NFTStorage, File } from "nft.storage";

export const uploadMetadataToIpfs = async (
	metadata: Record<string, unknown>,
	fileName: string
) => {
	const storage = new NFTStorage({
		token: process.env.NFT_STORAGE_KEY ?? "",
	});
	const metadataString = JSON.stringify(metadata);
	const metadataBuffer = Buffer.from(metadataString, "utf-8");

	const cid = await storage.storeDirectory([
		new File([metadataBuffer], fileName, { type: "application/json" }),
	]);
	return cid;
};
