import { TxConfirmData } from '@/pages/api/transaction/confirm';
import { TxSendData } from '@/pages/api/transaction/send';
import { useWallet } from '@solana/wallet-adapter-react';
import { Transaction } from '@solana/web3.js';
import React from 'react';
import toast from 'react-hot-toast';
import { fetcher } from '@/utils/useDataFetch';
import { TxCreateData } from '@/pages/api/assets/withdraw';
import { Asset } from '@/utils/constants/assets';
import { RectangleButton } from './RectangleButton';

interface Props {
  asset: Asset;
  text: string;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  onSuccess: () => void;
}

export const WithdrawButton = ({
  asset,
  text,
  isLoading,
  setIsLoading,
  onSuccess,
}: Props) => {
  const { publicKey, signTransaction, connected } = useWallet();

  const lock = async () => {
    if (!connected || !publicKey || !signTransaction || isLoading) {
      return;
    }
    setIsLoading(true);
    const buttonToastId = toast.loading('Preparing the transaction', {
      id: `buttonToast${'createTransaction'}`,
    });

    try {
      let { tx: txCreateResponse, shouldReceiveReward } =
        await fetcher<TxCreateData>('/api/assets/withdraw', {
          method: 'POST',
          body: JSON.stringify({
            walletAddress: publicKey.toBase58(),
            asset,
          }),
          headers: { 'Content-type': 'application/json; charset=UTF-8' },
        });

      const tx = Transaction.from(Buffer.from(txCreateResponse, 'base64'));

      // Request signature from wallet
      const signedTx = await signTransaction(tx);
      const signedTxBase64 = signedTx
        .serialize({ requireAllSignatures: true, verifySignatures: true })
        .toString('base64');

      // Send signed transaction
      let { txSignature } = await fetcher<TxSendData>('/api/transaction/send', {
        method: 'POST',
        body: JSON.stringify({
          signedTx: signedTxBase64,
          payer: publicKey.toBase58(),
          sendType: 'withdraw',
          shouldReceiveReward,
          asset,
        }),
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
      });
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
      onClick={async () => {
        await lock();
      }}
    >
      {text}
    </RectangleButton>
  );
};
