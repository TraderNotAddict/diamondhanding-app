import { NETWORK } from "@/utils/constants/endpoints";
import { Connection, PublicKey } from "@solana/web3.js";
import { NextApiRequest, NextApiHandler, NextApiResponse } from "next";
import { Program } from "@coral-xyz/anchor";
import idl from "src/utils/constants/idl.json";

const initialiseProgram = async () => {
	const connection = new Connection(NETWORK);
	// Replace with the correct program ID and path to the IDL JSON file
	const programId = new PublicKey(
		"5Zm2UQMSM63NLJGkQYP6xqqGm2EPzYyVNtyPpJnJb5iD"
	);
	const program = new Program(idl, programId, { connection });

	return { program, connection };
};

export interface NextApiRequestWithSolanaProgram extends NextApiRequest {
	program?: Program;
	solanaConnection?: Connection;
	key?: number[];
}

const connectSolana =
	(handler: NextApiHandler) =>
	async (req: NextApiRequest, res: NextApiResponse) => {
		const { program, connection: solanaConnection } = await initialiseProgram();
		const modifiedReq: NextApiRequestWithSolanaProgram = req;

		if (program) modifiedReq.program = program as unknown as Program;

		if (solanaConnection) modifiedReq.solanaConnection = solanaConnection;

		return handler(modifiedReq, res);
	};

export default connectSolana;
