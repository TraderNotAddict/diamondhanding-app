import { Memento } from "@/models/memento";

export const getAllMementosByWalletAddress = async (walletAddres: string) => {
	const mementos = await Memento.find({
		ownerSolanaWalletAddress: walletAddres,
	}).lean();
	return mementos;
};
