import { NftCollection } from "@/models/enums/NftCollection";
import { PublicKey } from "@solana/web3.js";

export const merkleTreesInfo = {
	[NftCollection.Dev1b]: {
		treeAddress: new PublicKey("pUa3apsUceUc7QvAmTr7YkGDBjnUzGJXMP1JayXaWCR"),
		treeAuthority: new PublicKey(
			"CjNoJgA4K6GB8TWRSaDQfV7pkBqT39L8WJ8cxcha3wdB"
		),
	},
};
