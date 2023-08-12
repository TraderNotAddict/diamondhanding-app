import { NftCollection } from "@/models/enums/NftCollection";
import { PublicKey } from "@solana/web3.js";

export const collectionsInfo = {
	[NftCollection.Dev1b]: {
		name: NftCollection.Dev1b,
		mint: new PublicKey("AkHo4wHxeHUtPCYxMBUMm6sa6db7jhquBxop67q9uVBi"),
		tokenAccount: new PublicKey("FuB2vSse2oekL21h5nTtyGbfe4RE8zHWfrQmvYb8kmAe"),
		metadataAccount: new PublicKey(
			"CWepuNocyJn6sqMPd2hmhvigzCZcwKs8ckQAb54KsWx3"
		),
		masterEditionAccount: new PublicKey(
			"7HEbKyBiLNNSY9EL94ZemTrEzFK2b13MzMmNjLp9Eo4A"
		),
	},
};
