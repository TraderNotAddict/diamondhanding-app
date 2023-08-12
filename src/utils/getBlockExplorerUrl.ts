/*
  Compute the Solana explorer address for the various data
*/
export function getBlockExplorerUrl({
	address,
	txSignature,
	cluster,
}: {
	address?: string;
	txSignature?: string;
	cluster?: "devnet" | "testnet" | "mainnet" | "mainnet-beta";
}) {
	let baseUrl: string;
	//
	if (address) baseUrl = `https://explorer.solana.com/address/${address}`;
	else if (txSignature)
		baseUrl = `https://explorer.solana.com/tx/${txSignature}`;
	else return "[unknown]";

	// auto append the desired search params
	const url = new URL(baseUrl);
	url.searchParams.append(
		"cluster",
		cluster || (process.env.CLUSTER ?? "devnet")
	);
	return url.toString() + "\n";
}
