import { Geometry } from "@/utils/getGeometryFromValueAndDuration";
import { Initiative } from "@/utils/getInitiativeRankFromNumberMinted";
import fs from "fs";
import path from "path";
import sharp from "sharp";

// image generation library
// return buffer
export const prepareImageForUpload = async ({
	geometry,
	initiative,
	artVariant,
}: {
	geometry: Geometry;
	initiative: Initiative;
	artVariant: number;
}): Promise<Buffer> => {
	const filePathBase = `public/images/art_variants/${geometry}`;
	const fileNameBase = `degen_${geometry.toLowerCase}_${artVariant}.png`; // testing
	const imagePathBase = path.join(process.cwd(), filePathBase, fileNameBase);
	const imageBufferBase = fs.readFileSync(imagePathBase);

	const filePathFlair = `public/images/initiatives`;
	const fileNameFlair = `${initiative}.png`; // testing
	const imagePathFlair = path.join(process.cwd(), filePathFlair, fileNameFlair);
	const imageBufferFlair = fs.readFileSync(imagePathFlair);

	const finalImageBuffer = await sharp(imageBufferBase)
		.composite([
			{
				input: imageBufferFlair,
			},
		])
		.toBuffer();

	return finalImageBuffer;
};
