import mongoose, { Schema, Model } from "mongoose";
import { mongooseObjectId } from "./utils/types";
import { TransactionInstruction } from "@solana/web3.js";
import { TransactionTypes } from "./enums/transactionTypes";

interface TransactionKey {
	pubkey: string;
	isSigner: boolean;
	isWritable: boolean;
}

export interface ITransactionInstruction {
	_id?: mongooseObjectId;
	transactionType: TransactionTypes;
	netTokensReceived?: number;
	tokenMintAddress?: string;
	keys: TransactionKey[];
	programId: string;
	data?: Buffer;
	owner: string;
	createdAt?: Date;
	updatedAt?: Date;
	confirmedAt?: Date;
}

const transactionKeySchema = new Schema<TransactionKey>({
	pubkey: String,
	isSigner: Boolean,
	isWritable: Boolean,
});

const transactionInstructionSchema = new Schema<
	ITransactionInstruction,
	Model<ITransactionInstruction>,
	ITransactionInstruction
>(
	{
		programId: {
			type: String,
			required: true,
		},
		transactionType: {
			type: String,
			required: true,
		},
		keys: [transactionKeySchema],
		data: {
			type: Buffer,
		},
		owner: String,
		netTokensReceived: Number,
		tokenMintAddress: String,
		confirmedAt: Date,
	},
	{
		read: "primary",
		timestamps: {
			createdAt: "createdAt",
			updatedAt: "updatedAt",
		},
	}
);

const TransactionInstructionModel: Model<ITransactionInstruction> =
	mongoose?.models?.transactionInstruction ||
	mongoose?.model<ITransactionInstruction>(
		"transactionInstruction",
		transactionInstructionSchema
	);

export { TransactionInstructionModel };
