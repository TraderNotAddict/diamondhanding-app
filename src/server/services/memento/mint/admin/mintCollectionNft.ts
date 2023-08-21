import { NftCollection } from "@/models/enums/NftCollection";
import {
	CreateMetadataAccountArgsV3,
	PROGRAM_ID as TOKEN_METADATA_PROGRAM_ID,
	createCreateMasterEditionV3Instruction,
	createCreateMetadataAccountV3Instruction,
} from "@metaplex-foundation/mpl-token-metadata";
import {
	Connection,
	Keypair,
	PublicKey,
	Transaction,
	sendAndConfirmTransaction,
} from "@solana/web3.js";
import { uploadImageToIpfsFromPath } from "../metadata/image/uploadImageToIpfs";
import { getIpfsUrl } from "@/utils/getIpfsUrl";
import { uploadMetadataToIpfs } from "../metadata/uploadMetadataToIpfs";
import {
	TOKEN_PROGRAM_ID,
	createAccount,
	createMint,
	mintTo,
} from "@solana/spl-token";
import { getBlockExplorerUrl } from "@/utils/getBlockExplorerUrl";
import { extractSignatureFromFailedTransaction } from "@/utils/extractSignatureFromFailedTransaction";

export const mintCollectionNft = async ({
	confirmedConnection,
	creatorWallet,
}: {
	confirmedConnection: Connection;
	creatorWallet: Keypair;
}) => {
	/*
    Create the actual NFT collection (using the normal Metaplex method)
    (nothing special about compression here)
  */
	// upload image to ipfs

	const cid = await uploadImageToIpfsFromPath(
		"cosmic_carats.png",
		"collection.png"
	);
	const url = getIpfsUrl(cid, "collection.png");
	console.log({ url });
	// create json
	const collectionJson = {
		name: NftCollection.CC,
		symbol: "CC",
		description:
			"Cosmic Carats is the first season of Mementos by Diamond Handing. It represents the eternal and universal beauty of perseverance and celebrates the diamond hands that truimph over greed and fear.",
		image: url,
		attributes: [],
		properties: {
			files: [
				{
					uri: url,
					type: "image/png",
				},
			],
		},
	};
	const collectionCid = await uploadMetadataToIpfs(
		collectionJson,
		"collection.json"
	);
	const metadataUrl = getIpfsUrl(collectionCid, "collection.json");
	console.log({ metadataUrl });

	// define the metadata to be used for creating the NFT collection
	const collectionMetadataV3: CreateMetadataAccountArgsV3 = {
		data: {
			name: NftCollection.CC,
			symbol: "CC",
			// specific json metadata for the collection
			uri: metadataUrl,
			sellerFeeBasisPoints: 100,
			creators: [
				{
					address: creatorWallet.publicKey,
					verified: false,
					share: 100,
				},
			], // or set to `null`
			collection: null,
			uses: null,
		},
		isMutable: true,
		collectionDetails: {
			__kind: "V1",
			size: 32000,
		},
	};

	// create a full token mint and initialize the collection (with the `payer` as the authority)
	const collection = await createCollection(
		confirmedConnection,
		creatorWallet,
		collectionMetadataV3
	);

	return collection;
};

/**
 * Create an NFT collection on-chain, using the regular Metaplex standards
 * with the `payer` as the authority
 */
export async function createCollection(
	connection: Connection,
	payer: Keypair,
	metadataV3: CreateMetadataAccountArgsV3
) {
	// create and initialize the SPL token mint
	console.log("Creating the collection's mint...");
	const mint = await createMint(
		connection,
		payer,
		// mint authority
		payer.publicKey,
		// freeze authority
		payer.publicKey,
		// decimals - use `0` for NFTs since they are non-fungible
		0
	);
	console.log("Mint address:", mint.toBase58());

	// create the token account
	console.log("Creating a token account...");
	const tokenAccount = await createAccount(
		connection,
		payer,
		mint,
		payer.publicKey
		// undefined, undefined,
	);
	console.log("Token account:", tokenAccount.toBase58());

	// mint 1 token ()
	console.log("Minting 1 token for the collection...");
	const mintSig = await mintTo(
		connection,
		payer,
		mint,
		tokenAccount,
		payer,
		// mint exactly 1 token
		1,
		// no `multiSigners`
		[],
		undefined,
		TOKEN_PROGRAM_ID
	);
	// console.log(explorerURL({ txSignature: mintSig }));

	// derive the PDA for the metadata account
	const [metadataAccount, _bump] = PublicKey.findProgramAddressSync(
		[
			Buffer.from("metadata", "utf8"),
			TOKEN_METADATA_PROGRAM_ID.toBuffer(),
			mint.toBuffer(),
		],
		TOKEN_METADATA_PROGRAM_ID
	);
	console.log("Metadata account:", metadataAccount.toBase58());

	// create an instruction to create the metadata account
	const createMetadataIx = createCreateMetadataAccountV3Instruction(
		{
			metadata: metadataAccount,
			mint: mint,
			mintAuthority: payer.publicKey,
			payer: payer.publicKey,
			updateAuthority: payer.publicKey,
		},
		{
			createMetadataAccountArgsV3: metadataV3,
		}
	);

	// derive the PDA for the master edition account
	const [masterEditionAccount, _bump2] = PublicKey.findProgramAddressSync(
		[
			Buffer.from("metadata", "utf8"),
			TOKEN_METADATA_PROGRAM_ID.toBuffer(),
			mint.toBuffer(),
			Buffer.from("edition", "utf8"),
		],
		TOKEN_METADATA_PROGRAM_ID
	);
	console.log("Master edition account:", masterEditionAccount.toBase58());

	// create an instruction to create the master edition account
	const createMasterEditionIx = createCreateMasterEditionV3Instruction(
		{
			edition: masterEditionAccount,
			mint: mint,
			mintAuthority: payer.publicKey,
			payer: payer.publicKey,
			updateAuthority: payer.publicKey,
			metadata: metadataAccount,
		},
		{
			createMasterEditionArgs: {
				maxSupply: 0,
			},
		}
	);

	try {
		// construct the transaction with our instructions, making the `payer` the `feePayer`
		const tx = new Transaction()
			.add(createMetadataIx)
			.add(createMasterEditionIx);
		tx.feePayer = payer.publicKey;

		// send the transaction to the cluster
		const txSignature = await sendAndConfirmTransaction(
			connection,
			tx,
			[payer],
			{
				commitment: "confirmed",
				skipPreflight: true,
			}
		);

		console.log("\nCollection successfully created!");
		console.log(getBlockExplorerUrl({ txSignature }));
	} catch (err) {
		console.error("\nFailed to create collection:", err);

		// log a block explorer link for the failed transaction
		await extractSignatureFromFailedTransaction(connection, err);

		throw err;
	}

	// return all the accounts
	return { mint, tokenAccount, metadataAccount, masterEditionAccount };
}
