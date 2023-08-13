import { ASSET_LIST, Asset } from "@/utils/constants/assets";
import { create } from "zustand";

type SelectedAssetState = {
	selectedAsset: Asset;
	setSelectedAsset: (selectedAsset: Asset) => void;
};

export const useSelectedAssetState = create<SelectedAssetState>((set) => ({
	selectedAsset: ASSET_LIST[0],
	setSelectedAsset: (selectedAsset: Asset) => set({ selectedAsset }),
}));
