import connectSolana, {
	NextApiRequestWithSolanaProgram,
} from "@/server/middleware/connectSolana";
import { NETWORK } from "@/utils/constants/endpoints";
import { web3 } from "@coral-xyz/anchor";
import { program } from "@coral-xyz/anchor/dist/cjs/native/system";
import { Connection, PublicKey } from "@solana/web3.js";
import { NextApiRequest, NextApiResponse } from "next";

export type TxConfirmData = {
	confirmed: boolean;
	message: string;
};
export default connectSolana(
	async (req: NextApiRequestWithSolanaProgram, res: NextApiResponse) => {
		if (req.method === "POST") {
			if (!req.solanaConnection) {
				return res.status(500).json({ error: "No connection" });
			}

			const specialConnection = new Connection(NETWORK, "confirmed");

			const {
				txSignature,
				txType,
				walletAddress,
				assetType,
				assetMintAddress,
			} = req.body;

			const latestBlockhash = await specialConnection.getLatestBlockhash(
				"finalized"
			);
			try {
				const confirmation = await specialConnection.confirmTransaction({
					signature: txSignature,
					blockhash: latestBlockhash.blockhash,
					lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
				});

				if (confirmation.value.err) {
					return res
						.status(200)
						.json({ confirmed: false, message: "Transaction not confirmed" });
				}

				if (walletAddress && assetType && assetMintAddress && req.program) {
					const encoder = new TextEncoder();
					const program = req.program;
					let runFunction;

					if (txType === "deposit") {
						runFunction = async (key: PublicKey) => {
							let attempts = 0;

							while (attempts < 10) {
								// 10 attempts at 2-second intervals = 20 seconds
								try {
									await program.account.store.fetch(key);
									return "Success condition met (account fetched)"; // Return success if the fetch is successful
								} catch (error) {
									attempts++;
									await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2 seconds before the next attempt
								}
							}

							throw new Error("Function threw an error after 20 seconds");
						};
					} else if (txType === "withdraw") {
						runFunction = async (key: PublicKey) => {
							let attempts = 0;

							while (attempts < 10) {
								// 10 attempts at 2-second intervals = 20 seconds
								try {
									await program.account.store.fetch(key);
									attempts++;
									await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2 seconds before the next attempt
								} catch (error) {
									return "Success condition met (error occurred)"; // Return success if an error occurs
								}
							}

							throw new Error(
								"Function did not throw an error after 20 seconds"
							);
						};
					}
					if (runFunction) {
						if (assetType === "native_token") {
							const [solStorePubkey, _] = web3.PublicKey.findProgramAddressSync(
								[encoder.encode("sol"), new PublicKey(walletAddress).toBytes()],
								program.programId
							);
							try {
								const result = await runFunction(solStorePubkey);
								console.log(result);
								return res
									.status(200)
									.json({ confirmed: true, message: "Transaction confirmed" });
							} catch (error) {
								console.error("Failure condition met:", error);
								return res.status(200).json({
									confirmed: false,
									message: "Transaction not confirmed",
								});
							}
						} else if (assetType === "solana_program_library_token") {
							const [splStorePubkey, _] = web3.PublicKey.findProgramAddressSync(
								[
									encoder.encode("spl"),
									new PublicKey(walletAddress).toBytes(),
									new PublicKey(assetMintAddress).toBytes(),
								],
								program.programId
							);
							try {
								const result = await runFunction(splStorePubkey);
								console.log(result);
								return res
									.status(200)
									.json({ confirmed: true, message: "Transaction confirmed" });
							} catch (error) {
								console.error("Failure condition met:", error);
								res.status(200).json({
									confirmed: false,
									message: "Transaction not confirmed",
								});
							}
						}
					}
				}

				return res
					.status(200)
					.json({ confirmed: true, message: "Transaction confirmed" });
			} catch (e) {
				return res
					.status(200)
					.json({ confirmed: false, message: "Transaction not confirmed" });
			}
		} else {
			return res
				.status(405)
				.json({ confirmed: false, message: "Method not allowed" });
		}
	}
);
