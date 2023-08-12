import { extractSignatureFromFailedTransaction } from "@/utils/extractSignatureFromFailedTransaction";
import {
	Connection,
	Keypair,
	PublicKey,
	Transaction,
	sendAndConfirmTransaction,
} from "@solana/web3.js";
import {
	PROGRAM_ID as BUBBLEGUM_PROGRAM_ID,
	createCreateTreeInstruction,
} from "@metaplex-foundation/mpl-bubblegum";
import {
	SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
	createAllocTreeIx,
	ValidDepthSizePair,
	SPL_NOOP_PROGRAM_ID,
} from "@solana/spl-account-compression";
import { getBlockExplorerUrl } from "@/utils/getBlockExplorerUrl";

/*
  Helper function to create a merkle tree on chain, including allocating 
  all the space required to store all the nodes
*/
export async function createMerkleTree({
	confirmedConnection,
	payer,
	maxDepthSizePair,
	canopyDepth = 0,
}: {
	confirmedConnection: Connection;
	payer: Keypair;
	maxDepthSizePair: ValidDepthSizePair;
	canopyDepth: number;
}) {
	console.log("Creating a new Merkle tree...");
	const treeKeypair = Keypair.generate();
	console.log("treeAddress:", treeKeypair.publicKey.toBase58());

	// derive the tree's authority (PDA), owned by Bubblegum
	const [treeAuthority, _bump] = PublicKey.findProgramAddressSync(
		[treeKeypair.publicKey.toBuffer()],
		BUBBLEGUM_PROGRAM_ID
	);
	console.log("treeAuthority:", treeAuthority.toBase58());

	// allocate the tree's account on chain with the `space`
	// NOTE: this will compute the space needed to store the tree on chain (and the lamports required to store it)
	const allocTreeIx = await createAllocTreeIx(
		confirmedConnection,
		treeKeypair.publicKey,
		payer.publicKey,
		maxDepthSizePair,
		canopyDepth
	);

	// create the instruction to actually create the tree
	const createTreeIx = createCreateTreeInstruction(
		{
			payer: payer.publicKey,
			treeCreator: payer.publicKey,
			treeAuthority,
			merkleTree: treeKeypair.publicKey,
			compressionProgram: SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
			// NOTE: this is used for some on chain logging
			logWrapper: SPL_NOOP_PROGRAM_ID,
		},
		{
			maxBufferSize: maxDepthSizePair.maxBufferSize,
			maxDepth: maxDepthSizePair.maxDepth,
			public: false,
		},
		BUBBLEGUM_PROGRAM_ID
	);

	try {
		// create and send the transaction to initialize the tree
		const tx = new Transaction().add(allocTreeIx).add(createTreeIx);
		tx.feePayer = payer.publicKey;

		// send the transaction
		const txSignature = await sendAndConfirmTransaction(
			confirmedConnection,
			tx,
			// ensuring the `treeKeypair` PDA and the `payer` are BOTH signers
			[treeKeypair, payer],
			{
				commitment: "confirmed",
				skipPreflight: true,
			}
		);

		console.log("\nMerkle tree created successfully!");
		console.log(getBlockExplorerUrl({ txSignature }));

		// return useful info
		return { treeAuthority, treeAddress: treeKeypair.publicKey };
	} catch (err: any) {
		console.error("\nFailed to create merkle tree:", err);

		// log a block explorer link for the failed transaction
		await extractSignatureFromFailedTransaction(confirmedConnection, err);

		throw err;
	}
}
