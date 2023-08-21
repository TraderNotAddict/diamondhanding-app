import { Geometry } from "@/utils/getGeometryFromValueAndDuration";
import { Initiative } from "@/utils/getInitiativeRankFromNumberMinted";
import sharp from "sharp";
import axios from "axios";
import { geometryImages, initiativeImages } from "@/utils/constants/images";

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
	console.log("preparing image for upload");
	console.log({
		geometry,
		initiative,
		artVariant,
	});

	const imageBufferBase = await getImageBuffer(
		geometryImages[geometry][artVariant].imageUrl
	);

	const imageBufferFlair = await getImageBuffer(
		initiativeImages[initiative].imageUrl
	);

	const finalImageBuffer = await sharp(imageBufferBase)
		.composite([
			{
				input: imageBufferFlair,
			},
		])
		.toBuffer();

	return finalImageBuffer;
};

const getImageBuffer = async (url: string): Promise<Buffer> => {
	const response = await axios.get(url, { responseType: "arraybuffer" });
	return Buffer.from(response.data, "binary");
};
