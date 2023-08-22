import { create } from "zustand";

type hodlModalState = {
	showHodlModal: boolean;
	setShowHodlModal: (showHodlModal: boolean) => void;
};

export const useHodlModalState = create<hodlModalState>((set) => ({
	showHodlModal: false,
	setShowHodlModal: (showHodlModal: boolean) => set({ showHodlModal }),
}));
