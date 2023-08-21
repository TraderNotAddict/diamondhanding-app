import { NFTStorage, File } from "nft.storage";

export const uploadImageToIpfs = async (image: Buffer, fileName: string) => {
	const storage = new NFTStorage({
		token: process.env.NFT_STORAGE_KEY ?? "",
	});
	const cid = await storage.storeDirectory([
		new File([image], fileName, { type: "image/png" }),
	]);
	return cid;
};
