// import connectSolana, {
// 	NextApiRequestWithSolanaProgram,
// } from "@/server/middleware/connectSolana";
// import { DebugInfo, sendErrorToDiscord } from "@/utils/sendErrorToDiscord";
// import { BN, web3 } from "@coral-xyz/anchor";
// import {
// 	Keypair,
// 	Transaction,
// 	SystemProgram,
// 	PublicKey,
// } from "@solana/web3.js";
// import { DateTime } from "luxon";
// import { NextApiResponse } from "next";
// import { TextEncoder } from "util";
// import {
// 	createAssociatedTokenAccountInstruction,
// 	getAssociatedTokenAddressSync,
// 	createTransferCheckedInstruction,
// 	TOKEN_PROGRAM_ID,
// } from "@solana/spl-token";
// import { ConcurrentMerkleTreeAccount } from "@solana/spl-account-compression";
// import { merkleTreesInfo } from "@/utils/constants/merkleTreesInfo";
// import { getCollectionMintProgress } from "@/server/services/memento/mint/getCollectionMintProgress";
// import { NftCollection } from "@/models/enums/NftCollection";
// import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
// import { NETWORK } from "@/utils/constants/endpoints";
// import {
// 	create,
// 	mplCandyMachine,
// } from "@metaplex-foundation/mpl-candy-machine";
// import withAuth from "@/server/middleware/withAuth";
// import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
// import { generateSigner, percentAmount, some } from "@metaplex-foundation/umi";
// import { TokenStandard } from "@metaplex-foundation/mpl-token-metadata";

// export default withAuth(
// 	connectSolana(
// 		async (req: NextApiRequestWithSolanaProgram, res: NextApiResponse) => {
// 			if (!req.solanaConnection || !req.program || !req.program?.programId) {
// 				return res.status(500).json({ tx: "" });
// 			}

// 			const umi = createUmi(NETWORK)
// 				.use(
// 					walletAdapterIdentity(
// 						Keypair.fromSecretKey(new Uint8Array(req.key ?? []))
// 					)
// 				)
// 				.use(mplCandyMachine());

// 			// Create the Collection NFT.
// 			const collectionUpdateAuthority = generateSigner(umi);
// 			const collectionMint = generateSigner(umi);
// 			// Create the Candy Machine.
// 			const candyMachine = generateSigner(umi);
// 			await (
// 				await create(umi, {
// 					candyMachine,
// 					collectionMint: collectionMint.publicKey,
// 					collectionUpdateAuthority,
// 					tokenStandard: TokenStandard.Fungible,
// 					sellerFeeBasisPoints: percentAmount(9.99, 2),
// 					itemsAvailable: 5000,
// 					creators: [
// 						{
// 							address: umi.identity.publicKey,
// 							verified: true,
// 							percentageShare: 100,
// 						},
// 					],
// 					configLineSettings: some({
// 						prefixName: "",
// 						nameLength: 32,
// 						prefixUri: "",
// 						uriLength: 200,
// 						isSequential: false,
// 					}),
// 				})
// 			).sendAndConfirm(umi);
// 			const metaplex = new res.status(200).json({ payer: umi.payer });
// 		}
// 	)
// );
