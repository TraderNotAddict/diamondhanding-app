import mongoose from "mongoose";

export type mongooseClientSession = mongoose.ClientSession;
export type mongooseObjectId =
	| string
	// | mongoose.Types.ObjectId
	| undefined
	| null;

export type mongooseDocument<T> = T & mongoose.Document;
