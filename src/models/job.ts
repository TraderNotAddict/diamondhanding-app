import mongoose, { Schema, Model } from "mongoose";
import { mongooseObjectId } from "./utils/types";
import { NftCollection } from "./enums/NftCollection";

export interface IJob {
	_id: mongooseObjectId;
	txId: string;
	nftCollection: NftCollection;
	valueLockedInUSD: number;
	durationLockedInSeconds: number;
	walletAddress: string;
	initiativeRank: string;
	archivedAt?: Date;
	verifiedAt?: Date;
	completedAt?: Date;
	createdAt?: Date;
	updatedAt?: Date;
}

const jobSchema = new Schema<IJob, Model<IJob>, IJob>(
	{
		nftCollection: {
			type: String,
			required: true,
		},
		txId: {
			type: String,
			required: true,
		},
		valueLockedInUSD: {
			type: Number,
			required: true,
		},
		durationLockedInSeconds: {
			type: Number,
			required: true,
		},
		walletAddress: {
			type: String,
			required: true,
		},
		initiativeRank: {
			type: String,
			required: true,
		},
		archivedAt: {
			type: Date,
		},
		verifiedAt: {
			type: Date,
		},
		completedAt: {
			type: Date,
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

const Job: Model<IJob> =
	mongoose?.models?.job || mongoose?.model<IJob>("job", jobSchema);

export { Job };
