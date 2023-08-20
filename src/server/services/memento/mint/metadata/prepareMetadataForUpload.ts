// generate name, description, traits
// return json buffer

export const prepareMetadataForUpload = async ({
	imageUrl,
}: {
	imageUrl: string;
}): Promise<Record<string, unknown>> => {
	const nftMetadata = {
		name: "Crystal Portal",
		symbol: "Dev1b",
		description:
			"Success is not how high you have climbed, but how you make a positive difference to the world",
		image: imageUrl,
		attributes: [
			{
				trait_type: "Geometry",
				value: "Dot",
			},
			{
				trait_type: "Initiative",
				value: "Trailblazer",
			},
			{
				trait_type: "Art Variant",
				value: "1",
			},
			{
				trait_type: "Quote",
				value: "1",
			},
		],
	};
	return nftMetadata;
};
