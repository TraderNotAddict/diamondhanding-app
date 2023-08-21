import fs from "fs";
import path from "path";
import { uploadImageToIpfs } from "./uploadImageToIpfs";

export const uploadImageToIpfsFromPath = async (
	fileName: string,
	newFileName?: string,
	filePath = "public/images/"
) => {
	const imagePath = path.join(process.cwd(), filePath, fileName);
	const imageBuffer = fs.readFileSync(imagePath);
	const cid = await uploadImageToIpfs(
		imageBuffer,
		newFileName ? newFileName : fileName
	);
	return cid;
};
