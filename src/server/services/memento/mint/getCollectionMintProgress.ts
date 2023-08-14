import { NftCollection } from "@/models/enums/NftCollection";
import { merkleTreesInfo } from "@/utils/constants/merkleTreesInfo";
import { ConcurrentMerkleTreeAccount } from "@solana/spl-account-compression";
import { Connection, PublicKey } from "@solana/web3.js";
import {
	fetchCandyMachine,
	fetchCandyGuard,
} from "@metaplex-foundation/mpl-candy-machine";
import { Umi, publicKey } from "@metaplex-foundation/umi";

export const getCollectionMintProgress = async (
	collection: NftCollection,
	connection: Connection,
	umi?: Umi
): Promise<number> => {
	if (collection === NftCollection.PH && umi) {
		const candyMachine = await fetchCandyMachine(
			umi,
			publicKey("candyMachineAddress")
		);
		return Number(candyMachine.itemsRedeemed);
	} else {
		const treeAccount = await ConcurrentMerkleTreeAccount.fromAccountAddress(
			connection,
			merkleTreesInfo[collection as keyof typeof merkleTreesInfo].treeAddress
		);
		return treeAccount.tree.rightMostPath.index ?? 0;
	}
};
