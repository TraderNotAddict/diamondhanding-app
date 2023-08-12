import { PublicKey, SystemProgram } from "@solana/web3.js";

export const createInstructionToSendSol = ({
	payer,
	receiver,
	amountInSol,
}: {
	payer: PublicKey;
	receiver: PublicKey;
	amountInSol: number;
}) => {
	return SystemProgram.transfer({
		fromPubkey: payer,
		toPubkey: receiver,
		lamports: amountInSol * 1000000000,
	});
};
