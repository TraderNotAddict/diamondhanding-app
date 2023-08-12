import { TxConfirmData } from "@/pages/api/transaction/confirm";
import { TxSendData } from "@/pages/api/transaction/send";
import { useWallet } from "@solana/wallet-adapter-react";
import { Transaction } from "@solana/web3.js";
import React from "react";
import toast from "react-hot-toast";
import { Button, ButtonState } from "../Button";
import { fetcher } from "@/utils/useDataFetch";
import { CLUSTER } from "@/utils/constants/endpoints";
import { TxCreateData } from "@/pages/api/assets/lock";

export interface MintButtonProps {}

export function MintButton({}: MintButtonProps) {
	const { publicKey, signTransaction, connected } = useWallet();

	const [txState, setTxState] = React.useState<ButtonState>(
		ButtonState.Initial
	);

	const mint = async () => {
		if (
			!connected ||
			!publicKey ||
			!signTransaction ||
			txState === ButtonState.Loading
		) {
			return;
		}
		setTxState(ButtonState.Loading);
		const buttonToastId = toast.loading("Preparing the transaction", {
			id: `buttonToast${"createTransaction"}`,
		});

		try {
			let { tx: txCreateResponse } = await fetcher<TxCreateData>(
				"/api/memento/mint",
				{
					method: "POST",
					body: JSON.stringify({
						payer: publicKey.toBase58(),
						mementoIds: ["64d7ca99c8a1d39d36d8420a"],
						amountToDonateInSol: 0,
						step: "Create",
					}),
					headers: { "Content-type": "application/json; charset=UTF-8" },
				}
			);

			const tx = Transaction.from(Buffer.from(txCreateResponse, "base64"));

			// Request signature from wallet
			const signedTx = await signTransaction(tx);
			const signedTxBase64 = signedTx
				.serialize({ requireAllSignatures: false, verifySignatures: true })
				.toString("base64");

			// Send signed transaction
			let { txSignature } = await fetcher<TxSendData>("/api/memento/mint", {
				method: "POST",
				body: JSON.stringify({
					signedTx: signedTxBase64,
					payer: publicKey.toBase58(),
					step: "Send",
				}),
				headers: { "Content-type": "application/json; charset=UTF-8" },
			});

			setTxState(ButtonState.Success);
			toast.success(
				(t) => (
					<a
						href={`https://solscan.io/tx/${txSignature}?cluster=devnet`}
						target="_blank"
						rel="noreferrer"
					>
						Transaction Sent
					</a>
				),
				{ id: buttonToastId, duration: 10000 }
			);

			const confirmationToastId = toast.loading("Just confirming...");

			const confirmationResponse = await fetcher<TxConfirmData>(
				"/api/transaction/confirm",
				{
					method: "POST",
					body: JSON.stringify({ txSignature }),
					headers: {
						"Content-type": "application/json; charset=UTF-8",
					},
				}
			);

			if (confirmationResponse.confirmed) {
				toast.success("Transaction Confirmed", {
					id: confirmationToastId,
				});
			} else {
				toast.success("Uh-oh, something went wrong!", {
					id: confirmationToastId,
				});
			}
		} catch (error) {
			setTxState(ButtonState.Error);
			// console.log(error);
			toast.error("Uh-oh, something went wrong!", {
				id: buttonToastId,
			});
		}
	};

	return (
		<>
			{connected && publicKey && (
				<>
					<Button
						state={txState}
						onClick={async () => {
							await mint();
						}}
						className="px-3 py-2 mr-2 text-gray-700 rounded hover:bg-gray-200 hover:text-gray-800 btn-secondary"
					>
						Mint
					</Button>
				</>
			)}
		</>
	);
}
