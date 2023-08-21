import { create } from "zustand";

type jobState = {
	hasJob: boolean;
	setHasJob: (hasJob: boolean) => void;
};

export const useJobState = create<jobState>((set) => ({
	hasJob: false,
	setHasJob: (hasJob: boolean) => set({ hasJob }),
}));
