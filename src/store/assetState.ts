import { UserAssetInfo } from "@/server/services/assets/retrieveAssetsByWalletAddress";
import { ASSET_LIST, Asset } from "@/utils/constants/assets";
import { create } from "zustand";

type AssetState = {
	selectedAsset: Asset;
	setSelectedAsset: (selectedAsset: Asset) => void;

	userAssets: UserAssetInfo[];
	setUserAssets: (userAssets: UserAssetInfo[]) => void;

	isGlobalLoading: boolean;
	setIsGlobalLoading: (isGlobalLoading: boolean) => void;
};

export const useAssetState = create<AssetState>((set) => ({
	selectedAsset: ASSET_LIST[0],
	setSelectedAsset: (selectedAsset: Asset) => set({ selectedAsset }),

	userAssets: [],
	setUserAssets: (userAssets: UserAssetInfo[]) => set({ userAssets }),

	isGlobalLoading: true,
	setIsGlobalLoading: (isGlobalLoading: boolean) => set({ isGlobalLoading }),
}));
