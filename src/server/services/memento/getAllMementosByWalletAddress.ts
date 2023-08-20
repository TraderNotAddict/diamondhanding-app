import { Memento } from "@/models/memento";

export const getAllMementosByWalletAddress = async (walletAddres: string) => {
	const mementos = await Memento.find({ walletAddress: walletAddres }).lean();
	return mementos;
};
