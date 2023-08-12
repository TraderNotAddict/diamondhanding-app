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
		description: "This is a test description for the NFT.",
		image: imageUrl,
		attributes: [
			{
				trait_type: "Duration Held",
				value: "Flash",
			},
			{
				trait_type: "Asset Value",
				value: "Degen",
			},
			{
				trait_type: "Variant",
				value: "1",
			},
			{
				trait_type: "Initiative",
				value: "Trailblazer",
				// "Trailblazer": Completed within the first 5% of the tier's time frame
				// "Pioneer": Completed within the first 10% of the tier's time frame
				// "Early Adopter": Completed within the first 25% of the tier's time frame
				// "Follower": Completed within the first 50% of the tier's time frame
				// "Latecomer": Completed after the first 50% of the tier's time frame
			},
		],
	};
	return nftMetadata;
};
