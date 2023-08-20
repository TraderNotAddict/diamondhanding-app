/*
  1. Reads a memento document
  2. Creates an encoded transaction based on the memento document
*/

import { Memento } from "@/models/memento";
import { collectionsInfo } from "@/utils/constants/collectionsInfo";
import { merkleTreesInfo } from "@/utils/constants/merkleTreesInfo";
import {
	MetadataArgs,
	TokenProgramVersion,
	TokenStandard,
	createMintToCollectionV1Instruction,
	PROGRAM_ID as BUBBLEGUM_PROGRAM_ID,
} from "@metaplex-foundation/mpl-bubblegum";
import {
	SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
	SPL_NOOP_PROGRAM_ID,
} from "@solana/spl-account-compression";
import { Keypair, PublicKey } from "@solana/web3.js";
import { PROGRAM_ID as TOKEN_METADATA_PROGRAM_ID } from "@metaplex-foundation/mpl-token-metadata";

export const createInstructionToMintCompressedNft = async ({
	mementoId,
	creatorWallet,
	payer,
}: {
	mementoId: string;
	creatorWallet: Keypair;
	payer: string;
}) => {
	// 1. Reads a memento document
	const mementoDoc = await Memento.findOne({ _id: mementoId }).lean();

	if (!mementoDoc) {
		throw new Error("Memento not found");
	}

	if (mementoDoc.mintedAt || mementoDoc.mintAddress) {
		throw new Error("Memento already minted");
	}

	if (!mementoDoc.image || !mementoDoc.metadataUri) {
		throw new Error("Memento image or metadataUri not found");
	}

	// 2. Creates an encoded transaction based on the memento document
	const collectionInfo =
		collectionsInfo[mementoDoc.nftCollection as keyof typeof collectionsInfo];
	const merkleTreeInfo =
		merkleTreesInfo[mementoDoc.nftCollection as keyof typeof merkleTreesInfo];
	const payerPublicKey = new PublicKey(payer);

	const compressedNFTMetadata: MetadataArgs = {
		name: mementoDoc.name,
		symbol: mementoDoc.symbol,
		// specific json metadata for each NFT
		uri: mementoDoc.metadataUri,
		creators: [
			{
				address: creatorWallet.publicKey,
				verified: false,
				share: 100,
			},
		], // or set to null
		editionNonce: 0,
		uses: null,
		collection: {
			key: collectionInfo.mint,
			verified: false,
		},
		primarySaleHappened: false,
		sellerFeeBasisPoints: 0,
		isMutable: false,
		// these values are taken from the Bubblegum package
		tokenProgramVersion: TokenProgramVersion.Original,
		tokenStandard: TokenStandard.NonFungible,
	};

	// derive a PDA (owned by Bubblegum) to act as the signer of the compressed minting
	const [bubblegumSigner, _bump2] = PublicKey.findProgramAddressSync(
		// `collection_cpi` is a custom prefix required by the Bubblegum program
		[Buffer.from("collection_cpi", "utf8")],
		BUBBLEGUM_PROGRAM_ID
	);

	const instruction = createMintToCollectionV1Instruction(
		{
			payer: payerPublicKey,

			merkleTree: merkleTreeInfo.treeAddress,
			treeAuthority: merkleTreeInfo.treeAuthority,
			treeDelegate: creatorWallet.publicKey,

			// set the receiver of the NFT
			leafOwner: payerPublicKey,
			// set a delegated authority over this NFT
			leafDelegate: payerPublicKey,

			/*
          You can set any delegate address at mint, otherwise should 
          normally be the same as `leafOwner`
          NOTE: the delegate will be auto cleared upon NFT transfer
          ---
          in this case, we are setting the payer as the delegate
        */

			// collection details
			collectionAuthority: creatorWallet.publicKey,
			collectionAuthorityRecordPda: BUBBLEGUM_PROGRAM_ID,
			collectionMint: collectionInfo.mint,
			collectionMetadata: collectionInfo.metadataAccount,
			editionAccount: collectionInfo.masterEditionAccount,

			// other accounts
			compressionProgram: SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
			logWrapper: SPL_NOOP_PROGRAM_ID,
			bubblegumSigner: bubblegumSigner,
			tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
		},
		{
			metadataArgs: compressedNFTMetadata,
		}
	);

	return instruction;
};
