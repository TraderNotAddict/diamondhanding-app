import connectSolana, {
  NextApiRequestWithSolanaProgram,
} from '@/server/middleware/connectSolana';
import { DebugInfo, sendErrorToDiscord } from '@/utils/sendErrorToDiscord';
import { BN, web3 } from '@coral-xyz/anchor';
import {
  Keypair,
  Transaction,
  SystemProgram,
  PublicKey,
} from '@solana/web3.js';
import { DateTime } from 'luxon';
import { NextApiResponse } from 'next';
import { TextEncoder } from 'util';

export type TxCreateData = {
  tx: string;
};

export default connectSolana(
  async (
    req: NextApiRequestWithSolanaProgram,
    res: NextApiResponse<TxCreateData>
  ) => {
    if (req.method === 'POST') {
      const { walletAddress, txnType, amount } = req.body; // for now switch between "deposit" and "withdraw" as MVP to test

      if (!req.solanaConnection || !req.program || !req.program?.programId) {
        return res.status(500).json({ tx: '' });
      }

      const connection = req.solanaConnection;
      const encoder = new TextEncoder();
      const program = req.program;

      try {
        let transaction: Transaction = new Transaction();

        const [solStorePubkey, _] = web3.PublicKey.findProgramAddressSync(
          [encoder.encode('sol'), new PublicKey(walletAddress).toBytes()],
          program.programId
        );

        let solStore;
        try {
          solStore = await program.account.solStore.fetch(solStorePubkey);
        } catch (error) {
          console.log('this ran');
          const instruction = await program.methods
            .initSolStore(
              new BN(DateTime.utc(2023, 8, 6, 13).toUnixInteger()),
              false
            )
            .accounts({
              solStore: solStorePubkey,
              signer: new PublicKey(walletAddress),
              systemProgram: SystemProgram.programId,
            })
            .instruction();

          if (!instruction) {
            return res.status(500).json({ tx: '' });
          }
          transaction.add(instruction);
        }

        if (txnType === 'deposit') {
          const depositInstruction = await program.methods
            .depositSol(new BN(amount * 1000000000))
            .accounts({
              solStore: solStorePubkey,
              systemProgram: SystemProgram.programId,
              signer: new PublicKey(walletAddress),
            })
            .instruction();

          if (!depositInstruction) {
            return res.status(500).json({ tx: '' });
          }

          transaction.add(depositInstruction);
        } else {
          const withdrawAndCloseAccountInstruction = await program.methods
            .withdrawSolAndCloseAccount()
            .accounts({
              solStore: solStorePubkey,
              signer: new PublicKey(walletAddress),
            })
            .instruction();

          transaction.add(withdrawAndCloseAccountInstruction);
        }

        const blockHash = (await connection.getLatestBlockhash('finalized'))
          .blockhash;
        transaction.feePayer = new PublicKey(walletAddress);
        transaction.recentBlockhash = blockHash;

        const ids = [];

        const serializedTransaction = transaction.serialize({
          requireAllSignatures: false, // only partially signed
          verifySignatures: true,
        });
        const transactionBase64 = serializedTransaction.toString('base64');

        return res.status(200).json({
          tx: transactionBase64,
        });
      } catch (error: any) {
        const info: DebugInfo = {
          errorType: 'Transaction Create Error',
          message: (error as Error).message,
          route: 'api/transaction/create.ts',
          data: {
            walletAddress,
          },
        };
        console.log(info);
        // sendErrorToDiscord(info);
        return res.status(500).json({ tx: '' });
      }
    } else {
      res.status(405).json({ tx: '' });
    }
  }
);
