import { NFTStorage, File } from "nft.storage";
import fs from "fs";
import path from "path";

export const uploadImageToIpfs = async (image: Buffer, fileName: string) => {
	const storage = new NFTStorage({
		token: process.env.NFT_STORAGE_KEY ?? "",
	});
	const cid = await storage.storeDirectory([
		new File([image], fileName, { type: "image/png" }),
	]);
	return cid;
};

export const uploadImageToIpfsFromPath = async (
	fileName: string,
	newFileName?: string,
	filePath = "public/images/base/"
) => {
	const imagePath = path.join(process.cwd(), filePath, fileName);
	const imageBuffer = fs.readFileSync(imagePath);
	const cid = await uploadImageToIpfs(
		imageBuffer,
		newFileName ? newFileName : fileName
	);
	return cid;
};
