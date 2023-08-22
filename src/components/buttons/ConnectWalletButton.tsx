import { WalletIcon, useWalletModal } from '@solana/wallet-adapter-react-ui';
import { RectangleButton, RectangleButtonProps } from './RectangleButton';
import { Wallet, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Box, Button, Stack } from '@chakra-ui/react';

const LABELS = {
  'change-wallet': 'Change wallet',
  connecting: 'Connecting ...',
  'copy-address': 'Copy address',
  copied: 'Copied',
  disconnect: 'Disconnect',
  'has-wallet': 'Connect',
  'no-wallet': 'Select Wallet',
} as const;

interface ConnectWalletButtonProps
  extends Omit<
    RectangleButtonProps,
    'aria-expanded' | 'onClick' | 'leftIcon'
  > {}

// TODO: Add dropdown support
export const ConnectWalletButton = (props: ConnectWalletButtonProps) => {
  const { setVisible: setModalVisible } = useWalletModal();
  const {
    buttonState,
    onConnect,
    onDisconnect,
    publicKey,
    walletIcon,
    walletName,
  } = useWalletMultiButton({
    onSelectWallet() {
      setModalVisible(true);
    },
  });
  const [copied, setCopied] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const ref = useRef<HTMLUListElement>(null);
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      const node = ref.current;
      // Do nothing if clicking dropdown or its descendants
      if (!node || node.contains(event.target as Node)) return;
      setMenuOpen(false);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, []);
  const content = useMemo(() => {
    if (publicKey) {
      const base58 = publicKey.toBase58();
      return base58.slice(0, 4) + '..' + base58.slice(-4);
    } else if (buttonState === 'connecting' || buttonState === 'has-wallet') {
      return LABELS[buttonState];
    } else {
      return LABELS['no-wallet'];
    }
  }, [buttonState, publicKey]);
  return (
    <Box position="relative" display="inline-block">
      <RectangleButton
        {...props}
        aria-expanded={menuOpen}
        onClick={() => {
          switch (buttonState) {
            case 'no-wallet':
              setModalVisible(true);
              break;
            case 'has-wallet':
              if (onConnect) {
                onConnect();
              }
              break;
            case 'connected':
              setMenuOpen((open) => !open);
              break;
          }
        }}
        leftIcon={
          walletIcon && walletName ? (
            <WalletIcon
              style={{ width: '1em', zIndex: 1 }}
              wallet={{ adapter: { icon: walletIcon, name: walletName } }}
            />
          ) : undefined
        }
      >
        {content}
      </RectangleButton>
      <Stack
        position="absolute"
        zIndex={99}
        top="100%"
        right={0}
        opacity={menuOpen ? 1 : 0}
        visibility={menuOpen ? 'visible' : 'hidden'}
        transform={menuOpen ? 'translateY(10px)' : undefined}
        transition="opacity 200ms ease, transform 200ms ease, visibility 200ms"
        width="100%"
        spacing={1}
      >
        {publicKey ? (
          <RectangleButton
            onClick={async () => {
              await navigator.clipboard.writeText(publicKey.toBase58());
              setCopied(true);
              setTimeout(() => setCopied(false), 400);
            }}
            role="menuitem"
          >
            {copied ? LABELS['copied'] : LABELS['copy-address']}
          </RectangleButton>
        ) : null}
        <RectangleButton
          onClick={async () => {
            setModalVisible(true);
            setMenuOpen(false);
          }}
          role="menuitem"
        >
          {LABELS['change-wallet']}
        </RectangleButton>
        {onDisconnect ? (
          <RectangleButton
            onClick={async () => {
              onDisconnect();
              setMenuOpen(false);
            }}
            role="menuitem"
          >
            {LABELS['disconnect']}
          </RectangleButton>
        ) : null}
      </Stack>
    </Box>
  );
};

type ButtonState = {
  buttonState:
    | 'connecting'
    | 'connected'
    | 'disconnecting'
    | 'has-wallet'
    | 'no-wallet';
  onConnect?: () => void;
  onDisconnect?: () => void;
  onSelectWallet?: () => void;
  publicKey?: PublicKey;
  walletIcon?: Wallet['adapter']['icon'];
  walletName?: Wallet['adapter']['name'];
};

type Config = {
  onSelectWallet: (config: {
    onSelectWallet: (walletName: Wallet['adapter']['name']) => void;
    wallets: Wallet[];
  }) => void;
};

function useWalletMultiButton({ onSelectWallet }: Config): ButtonState {
  const {
    connect,
    connected,
    connecting,
    disconnect,
    disconnecting,
    publicKey,
    select,
    wallet,
    wallets,
  } = useWallet();
  let buttonState: ButtonState['buttonState'];
  if (connecting) {
    buttonState = 'connecting';
  } else if (connected) {
    buttonState = 'connected';
  } else if (disconnecting) {
    buttonState = 'disconnecting';
  } else if (wallet) {
    buttonState = 'has-wallet';
  } else {
    buttonState = 'no-wallet';
  }
  const handleConnect = useCallback(() => {
    connect().catch(() => {
      // Silently catch because any errors are caught by the context `onError` handler
    });
  }, [connect]);
  const handleDisconnect = useCallback(() => {
    disconnect().catch(() => {
      // Silently catch because any errors are caught by the context `onError` handler
    });
  }, [disconnect]);
  const handleSelectWallet = useCallback(() => {
    onSelectWallet({ onSelectWallet: select, wallets });
  }, [onSelectWallet, select, wallets]);
  return {
    buttonState,
    onConnect: buttonState === 'has-wallet' ? handleConnect : undefined,
    onDisconnect:
      buttonState !== 'disconnecting' && buttonState !== 'no-wallet'
        ? handleDisconnect
        : undefined,
    onSelectWallet: handleSelectWallet,
    publicKey: publicKey ?? undefined,
    walletIcon: wallet?.adapter.icon,
    walletName: wallet?.adapter.name,
  };
}
