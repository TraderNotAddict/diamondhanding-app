import { NftCollection } from "@/models/enums/NftCollection";

export const getInitiativeRankFromNumberMinted = ({
	numberMinted,
	nftCollection,
}: {
	numberMinted: number;
	nftCollection: string;
}) => {
	if (nftCollection === NftCollection.CCSH) {
		const percentage = (numberMinted / 32000) * 100;
		if (percentage <= 5) return "Trailblazer";
		if (percentage <= 10) return "Pioneer";
		if (percentage <= 25) return "Alpha";
		if (percentage <= 50) return "Early";
		return "Normie";
	} else if (nftCollection == NftCollection.Dev1b) {
		return "Pioneer";
	} else {
		throw new Error("Invalid nftCollection");
	}
};
