import { Box, HStack, Stack, Text, useBreakpointValue } from '@chakra-ui/react';
import { SolanaLogo } from './icons/SolanaLogo';
import { ConnectWalletButton } from './buttons/ConnectWalletButton';
import { SquareIconButton } from './buttons/SquareIconButton';
import { DiscordIcon } from './icons/DiscordIcon';
import { GitHubIcon } from './icons/GitHubIcon';
import { RectangleButton } from './buttons/RectangleButton';

import { AnimatePresence } from 'framer-motion';
import { MarinadeLogo } from './icons/MarinadeLogo';
import { useSelectedAssetState } from '@/store';
import { ASSET_LIST, Asset } from '@/utils/constants/assets';
import { useWallet } from '@solana/wallet-adapter-react';
import { LockCarousel } from './LockCarousel';
import { useEffect, useState } from 'react';
import { UserAssetInfo } from '@/server/services/assets/retrieveAssetsByWalletAddress';
import { NewHoldModal } from './modals/NewHoldModal';

export const Hero = () => {
  const selectedAsset = useSelectedAssetState((state) => state.selectedAsset);
  const setSelectedAsset = useSelectedAssetState(
    (state) => state.setSelectedAsset
  );
  const right = useBreakpointValue({
    base: '0',
    md: '20',
  });
  const toShowSideFades = useBreakpointValue({
    base: false,
    md: true,
  });
  const { publicKey, connecting, connected } = useWallet();
  const [hasStartedConnecting, setHasStartedConnecting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [assets, setAssets] = useState<UserAssetInfo[]>([]);
  const [isError, setIsError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    let didCancel = false;

    if (
      !connecting &&
      !hasStartedConnecting &&
      !(connected && assets.length === 0) // Adding this condition to support hot reload
    ) {
      setTimeout(() => {
        // If after some time, we still have not started connecting, then we'll stop loading.
        if (!didCancel) {
          setIsLoading(false);
        }
      }, 500);
      return () => {
        didCancel = true;
      };
    }
    if (connecting) {
      setHasStartedConnecting(true);
      return;
    }
    if (publicKey == null) {
      setIsLoading(false);
      return;
    }

    fetch(`api/assets/${publicKey}`)
      .then((res) => {
        res.json().then((data) => {
          if (!didCancel) {
            setAssets(data.userAssets as UserAssetInfo[]);
            setIsLoading(false);
          }
        });
      })
      .catch(() => {
        if (!didCancel) {
          setIsError(true);
          setIsLoading(false);
        }
      });

    return () => {
      didCancel = true;
    };
  }, [connecting, hasStartedConnecting, connected, assets.length, publicKey]);

  const getLogo = () => {
    switch (selectedAsset.symbol) {
      case 'SOL':
        return <SolanaLogo key="solana" />;
      case 'mSOL':
        return <MarinadeLogo key="marinade" />;
    }
  };

  return (
    <>
      <Box height={450} width="100%" position="relative">
        {/* Background below */}
        <Box position="absolute" top={0} height={450} width="100%" zIndex={-1}>
          <Box position="relative" height={450} width="100%" overflow="hidden">
            <Box position="absolute" top={-2} width={600} right={right}>
              <AnimatePresence>{getLogo()}</AnimatePresence>
            </Box>
            <Box
              height={450}
              width="100%"
              position="absolute"
              bgGradient="linear(transparent 0%,  #131315 100%)"
            />
            {toShowSideFades && (
              <Box
                height={450}
                width="100%"
                position="absolute"
                bgGradient="linear(to-r, transparent 95%,  #131315 100%)"
              />
            )}
            {toShowSideFades && (
              <Box
                height={450}
                width="100%"
                position="absolute"
                bgGradient="linear(to-l, transparent 95%,  #131315 100%)"
              />
            )}
          </Box>
        </Box>
        {/* Content on top */}
        <Stack height={450} width="100%" justify="space-between" px={2}>
          <HStack mt={4} alignItems="flex-start" spacing="2">
            {assets.map((asset) => {
              return (
                <RectangleButton
                  key={asset.asset.symbol}
                  isActive={selectedAsset.symbol === asset.asset.symbol}
                  onClick={() =>
                    setSelectedAsset(
                      ASSET_LIST.find(
                        (a) => a.symbol === asset.asset.symbol
                      ) as Asset
                    )
                  }
                >
                  {asset.asset.symbol}
                </RectangleButton>
              );
            })}
          </HStack>
          <Stack alignItems="flex-start" spacing={0}>
            <Text
              bgGradient="linear(to-r, #D16BA5, #86A8E7, #5FFBF1 80%)"
              fontSize="6xl"
              lineHeight="90%"
              bgClip="text"
            >
              Diamond Handing.
            </Text>
            <Text fontSize="6xl" color="white" lineHeight="90%">
              No Greed. No Fear.
            </Text>
            <HStack mt={4} spacing="2">
              {connected ? (
                <RectangleButton onClick={() => setIsModalOpen(true)}>
                  START NEW HOLD
                </RectangleButton>
              ) : (
                <ConnectWalletButton />
              )}
              <SquareIconButton
                aria-label="Discord"
                icon={<DiscordIcon />}
                variant="ghost"
              />
              <SquareIconButton
                aria-label="GitHub"
                icon={<GitHubIcon />}
                variant="ghost"
              />
            </HStack>
            <LockCarousel
              isLoading={isLoading}
              assets={assets.filter((a) => a.hasOngoingSession)}
              shouldShowAddButton={
                assets.filter((a) => !a.hasOngoingSession).length > 0
              }
              onAddButtonClick={() => setIsModalOpen(true)}
            />
          </Stack>
        </Stack>
      </Box>
      <NewHoldModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};
