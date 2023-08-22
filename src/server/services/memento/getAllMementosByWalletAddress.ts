import { Memento } from "@/models/memento";

export const getAllMementosByWalletAddress = async (walletAddres: string) => {
	const mementos = await Memento.find({
		ownerSolanaWalletAddress: walletAddres,
	})
		.lean()
		.sort({ createdAt: -1 });
	return mementos;
};
