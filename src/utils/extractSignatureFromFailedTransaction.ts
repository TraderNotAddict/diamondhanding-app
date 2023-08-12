import { Connection } from "@solana/web3.js";
import { getBlockExplorerUrl } from "./getBlockExplorerUrl";

/*
  Helper function to extract a transaction signature from a failed transaction's error message
*/
export async function extractSignatureFromFailedTransaction(
	connection: Connection,
	err: any,
	fetchLogs?: boolean
) {
	if (err?.signature) return err.signature;

	// extract the failed transaction's signature
	const failedSig = new RegExp(
		/^((.*)?Error: )?(Transaction|Signature) ([A-Z0-9]{32,}) /gim
	).exec(err?.message?.toString())?.[4];

	// ensure a signature was found
	if (failedSig) {
		// when desired, attempt to fetch the program logs from the cluster
		if (fetchLogs)
			await connection
				.getTransaction(failedSig, {
					maxSupportedTransactionVersion: 0,
				})
				.then((tx) => {
					console.log(`\n==== Transaction logs for ${failedSig} ====`);
					console.log(getBlockExplorerUrl({ txSignature: failedSig }), "");
					console.log(
						tx?.meta?.logMessages ?? "No log messages provided by RPC"
					);
					console.log(`==== END LOGS ====\n`);
				});
		else {
			console.log("\n========================================");
			console.log(getBlockExplorerUrl({ txSignature: failedSig }));
			console.log("========================================\n");
		}
	}

	// always return the failed signature value
	return failedSig;
}
