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
	[NftCollection.CC]: {
		name: NftCollection.CC,
		mint: new PublicKey("6u6a9p5rF6Q1SgDr31Ecr4xYxp45iFhrdhYwm9gp5Ghg"),
		tokenAccount: new PublicKey("2Xykhj4enxdHnBqikgAYBFwrSYv6cgmVZsQQrFLjXjF6"),
		metadataAccount: new PublicKey(
			"DdLWdwf8H1UKq6h17wH9tn2HncUBFEewT5tdLnWqQaCS"
		),
		masterEditionAccount: new PublicKey(
			"9RqwQg382cJCKdyo6ChndVwCjd45BWJpjqdCU96urS7b"
		),
	},
};
