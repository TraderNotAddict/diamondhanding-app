// generate name, description, traits
// return json buffer

import { NftCollection } from "@/models/enums/NftCollection";
import { quotes } from "@/utils/constants/quotes";
import { Geometry } from "@/utils/getGeometryFromValueAndDuration";
import { Initiative } from "@/utils/getInitiativeRankFromNumberMinted";
import { pickRandomElement } from "@/utils/pickRandomArrayElement";

export const prepareMetadataForUpload = async ({
	geometry,
	initiative,
	imageUrl,
	artVariant,
}: {
	geometry: Geometry;
	initiative: Initiative;
	imageUrl: string;
	artVariant: number;
}): Promise<Record<string, unknown>> => {
	const [quoteIndex, quote] = pickRandomElement(quotes[geometry]);
	const nftMetadata = {
		name: `Cosmic Carats: ${geometry}`,
		symbol: "CC",
		description: `${quote}`,
		image: imageUrl,
		attributes: [
			{
				trait_type: "Geometry",
				value: geometry,
			},
			{
				trait_type: "Initiative",
				value: initiative,
			},
			{
				trait_type: "Art Variant",
				value: `${geometry} ${artVariant}`,
			},
			{
				trait_type: "Quote",
				value: `${geometry} ${quoteIndex}`,
			},
		],
	};
	return nftMetadata;
};
