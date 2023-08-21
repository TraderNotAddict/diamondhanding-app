import mongoose, { Schema, Model } from "mongoose";
import { mongooseObjectId } from "./utils/types";
import { NftCollection } from "./enums/NftCollection";
import { Initiative } from "@/utils/getInitiativeRankFromNumberMinted";

export interface IJob {
	_id: mongooseObjectId;
	txId: string;
	assetLocked: string;
	quantityLocked: number;
	nftCollection: NftCollection;
	valueLockedInUSD: number;
	durationLockedInSeconds: number;
	didMeetGoal: boolean;
	walletAddress: string;
	initiativeRank: Initiative;
	archivedAt?: Date;
	transactionSentOutAt?: Date;
	verifiedAt?: Date;
	lockedUntil?: Date;
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
		},
		assetLocked: {
			type: String,
			required: true,
		},
		quantityLocked: {
			type: Number,
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
		didMeetGoal: {
			type: Boolean,
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
		transactionSentOutAt: {
			type: Date,
		},
		lockedUntil: {
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
