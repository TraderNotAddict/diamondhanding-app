import fs from "fs";
import path from "path";

// image generation library
// return buffer
export const prepareImageForUpload = async (): Promise<Buffer> => {
	const filePath = "public/images/base/";
	const fileName = "portal_1.png"; // testing

	const imagePath = path.join(process.cwd(), filePath, fileName);
	const imageBuffer = fs.readFileSync(imagePath);

	return imageBuffer;
};
