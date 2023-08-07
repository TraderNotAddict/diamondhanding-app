import { LockButton } from '@/components/lock-assets/LockButton';
import { WithdrawButton } from '@/components/lock-assets/WithdrawButton';
import { Navbar } from '@/components/navbar';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { NextPage } from 'next';

const Home: NextPage = () => {
  const { publicKey, signTransaction, connected } = useWallet();

  return (
    <>
      <Navbar />
      <div>Test</div>
      <div className="">
        <WalletMultiButton className="" />
        <div>
          <LockButton />
        </div>
        <div>
          <WithdrawButton />
        </div>
      </div>
    </>
  );
};

export default Home;
