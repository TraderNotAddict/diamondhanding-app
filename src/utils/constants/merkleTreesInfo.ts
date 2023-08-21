import { NftCollection } from "@/models/enums/NftCollection";
import { PublicKey } from "@solana/web3.js";

export const merkleTreesInfo = {
	[NftCollection.Dev1b]: {
		treeAddress: new PublicKey("pUa3apsUceUc7QvAmTr7YkGDBjnUzGJXMP1JayXaWCR"),
		treeAuthority: new PublicKey(
			"CjNoJgA4K6GB8TWRSaDQfV7pkBqT39L8WJ8cxcha3wdB"
		),
	},
	[NftCollection.CC]: {
		treeAuthority: new PublicKey(
			"9FdDw1facsK6JLovUS6wpn6nEhK1a6JocPjhjm9VMbtU"
		),
		treeAddress: new PublicKey("8VZdywt2BYNrLYWYvFzcpNQNE4paVyVk2GsaKEYHb68"),
	},
};
