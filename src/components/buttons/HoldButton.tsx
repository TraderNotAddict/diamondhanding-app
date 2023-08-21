import { TxConfirmData } from '@/pages/api/transaction/confirm';
import { TxSendData } from '@/pages/api/transaction/send';
import { useWallet } from '@solana/wallet-adapter-react';
import { Transaction } from '@solana/web3.js';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { TxCreateData } from '@/pages/api/assets/lock';
import { DateTime } from 'luxon';
import { Asset } from '@/utils/constants/assets';
import { RectangleButton } from './RectangleButton';
import { fetcher } from '@/utils/useDataFetch';

interface Props {
  isDisabled: boolean;
  asset: Asset;
  amount: string;
  unlockDate: Date;
  canManuallyUnlock: boolean;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  onSuccess: () => void;
}

export const HoldButton = ({
  isDisabled,
  asset,
  amount,
  unlockDate,
  canManuallyUnlock,
  isLoading,
  setIsLoading,
  onSuccess,
}: Props) => {
  const { publicKey, signTransaction, connected } = useWallet();
  const [jobId, setJobId] = useState<string>('');

  const lock = async () => {
    if (!connected || !publicKey || !signTransaction || isLoading) {
      return;
    }
    setIsLoading(true);
    const buttonToastId = toast.loading('Preparing the transaction', {
      id: `buttonToast${'createTransaction'}`,
    });

    try {
      let { tx: txCreateResponse, txId } = await fetcher<TxCreateData>(
        '/api/assets/lock',
        {
          method: 'POST',
          body: JSON.stringify({
            walletAddress: publicKey.toBase58(),
            amount: parseFloat(amount),
            asset: asset,
            unlockDate: DateTime.fromJSDate(unlockDate).toSeconds(),
            canManuallyUnlock,
          }),
          headers: { 'Content-type': 'application/json; charset=UTF-8' },
        }
      );

      const tx = Transaction.from(Buffer.from(txCreateResponse, 'base64'));

      // Request signature from wallet
      const signedTx = await signTransaction(tx);
      const signedTxBase64 = signedTx
        .serialize({ requireAllSignatures: true, verifySignatures: true })
        .toString('base64');

      // Send signed transaction
      let { txSignature, jobId } = await fetcher<TxSendData>(
        '/api/transaction/send',
        {
          method: 'POST',
          body: JSON.stringify({
            signedTx: signedTxBase64,
            payer: publicKey.toBase58(),
            txId: txId,
            sendType: 'lock',
          }),
          headers: { 'Content-type': 'application/json; charset=UTF-8' },
        }
      );

      if (jobId && jobId !== '') {
        // run route to fetch job status async
        // TODO: UI improvements here to show progress
      }
      toast.success(
        (t) => (
          <a
            href={`https://solscan.io/tx/${txSignature}?cluster=devnet`}
            target="_blank"
            rel="noreferrer"
          >
            Transaction Sent
          </a>
        ),
        { id: buttonToastId, duration: 10000 }
      );

      const confirmationToastId = toast.loading('Just confirming...');

      const confirmationResponse = await fetcher<TxConfirmData>(
        '/api/transaction/confirm',
        {
          method: 'POST',
          body: JSON.stringify({ txSignature }),
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        }
      );

      setIsLoading(false);
      if (confirmationResponse.confirmed) {
        toast.success('Transaction Confirmed', {
          id: confirmationToastId,
        });
        onSuccess();
      } else {
        toast.success('Uh-oh, something went wrong!', {
          id: confirmationToastId,
        });
      }
    } catch (error) {
      setIsLoading(false);
      toast.error('Uh-oh, something went wrong!', {
        id: buttonToastId,
      });
    }
  };

  return (
    <RectangleButton
      isLoading={isLoading}
      isDisabled={isDisabled}
      onClick={async () => {
        await lock();
      }}
    >
      HODL
    </RectangleButton>
  );
};
