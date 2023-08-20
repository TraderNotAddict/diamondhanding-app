import mongoose, { Schema, Model } from "mongoose";
import { mongooseObjectId } from "./utils/types";

export interface IWallet {
	_id?: string;
	createdAt?: Date;
	updatedAt?: Date;
}

export const walletSchema = new Schema<IWallet, Model<IWallet>, IWallet>(
	{
		_id: {
			type: String,
			required: true,
		},
	},
	{
		read: "primary",
		timestamps: {
			createdAt: "createdAt",
			updatedAt: "updatedAt",
		},
	}
);

const Wallet: Model<IWallet> =
	mongoose?.models?.wallet || mongoose?.model<IWallet>("wallet", walletSchema);

export { Wallet };
