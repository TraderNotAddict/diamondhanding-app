import { TxConfirmData } from "@/pages/api/transaction/confirm";
import { TxSendData } from "@/pages/api/transaction/send";
import { useWallet } from "@solana/wallet-adapter-react";
import { Transaction } from "@solana/web3.js";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { TxCreateData } from "@/pages/api/assets/lock";
import { DateTime } from "luxon";
import { Asset } from "@/utils/constants/assets";
import { RectangleButton } from "./RectangleButton";
import { fetcher } from "@/utils/useDataFetch";
import { useAssetState, useJobState } from "@/store";
import { mutate } from "swr";

interface Props {
	isDisabled: boolean;
	asset: Asset;
	initialBalance: number;
	amount: string;
	unlockDate: Date;
	canManuallyUnlock: boolean;
	onSuccess: () => void;
}

export const HoldButton = ({
	isDisabled,
	initialBalance,
	asset,
	amount,
	unlockDate,
	canManuallyUnlock,
	onSuccess,
}: Props) => {
	const { publicKey, signTransaction, connected } = useWallet();
	const setHasJob = useJobState((state) => state.setHasJob);
	const [isLoading, setIsLoading] = useAssetState((state) => [
		state.isGlobalLoading,
		state.setIsGlobalLoading,
	]);

	const lock = async () => {
		if (!connected || !publicKey || !signTransaction || isLoading) {
			return;
		}
		setIsLoading(true);
		const buttonToastId = toast.loading("Preparing the transaction", {
			id: `buttonToast${"createTransaction"}`,
		});

		try {
			let { tx: txCreateResponse, txId } = await fetcher<TxCreateData>(
				"/api/assets/lock",
				{
					method: "POST",
					body: JSON.stringify({
						walletAddress: publicKey.toBase58(),
						amount: parseFloat(amount),
						asset: asset,
						unlockDate: DateTime.fromJSDate(unlockDate).toSeconds(),
						canManuallyUnlock,
					}),
					headers: { "Content-type": "application/json; charset=UTF-8" },
				}
			);

			const tx = Transaction.from(Buffer.from(txCreateResponse, "base64"));

			// Request signature from wallet
			const signedTx = await signTransaction(tx);
			const signedTxBase64 = signedTx
				.serialize({ requireAllSignatures: true, verifySignatures: true })
				.toString("base64");

			// Send signed transaction
			let { txSignature, jobId: jobIdCreated } = await fetcher<TxSendData>(
				"/api/transaction/send",
				{
					method: "POST",
					body: JSON.stringify({
						signedTx: signedTxBase64,
						payer: publicKey.toBase58(),
						txId: txId,
						sendType: "lock",
					}),
					headers: { "Content-type": "application/json; charset=UTF-8" },
				}
			);

			console.log("jobIdCreated", jobIdCreated);

			if (jobIdCreated && jobIdCreated !== "") {
				console.log("ran");
				setHasJob(true);
			}
			toast.success(
				(t) => (
					<a
						href={`https://solscan.io/tx/${txSignature}?cluster=mainnet`}
						target="_blank"
						rel="noreferrer"
					>
						Transaction Sent
					</a>
				),
				{ id: buttonToastId, duration: 10000 }
			);

			const confirmationToastId = toast.loading(
				"Checking your HODL vault... You may safely leave this page."
			);

			const confirmationResponse = await fetcher<TxConfirmData>(
				"/api/transaction/confirm",
				{
					method: "POST",
					body: JSON.stringify({
						txSignature,
						initialBalance: initialBalance,
						txType: "deposit",
						walletAddress: publicKey.toBase58(),
						assetType: asset.type,
						assetMintAddress: asset.mintAddress,
					}),
					headers: {
						"Content-type": "application/json; charset=UTF-8",
					},
				}
			);

			// mutate(`/api/assets/${publicKey.toBase58()}`);
			if (confirmationResponse.confirmed) {
				onSuccess();
				toast.success("Assets SAFU and HODLed!", {
					id: confirmationToastId,
				});
			} else {
				toast.success("Uh-oh, something went wrong!", {
					id: confirmationToastId,
				});
			}
			setIsLoading(false);
		} catch (error) {
			setIsLoading(false);
			toast.error("Uh-oh, something went wrong!", {
				id: buttonToastId,
			});
		}
	};

	return (
		<RectangleButton
			isLoading={isLoading}
			isDisabled={isDisabled}
			onClick={async () => {
				await lock();
			}}
		>
			HODL
		</RectangleButton>
	);
};
