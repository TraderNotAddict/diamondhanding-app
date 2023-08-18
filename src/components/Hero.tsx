import {
  Box,
  HStack,
  Highlight,
  Stack,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react';
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

  const getLogo = () => {
    switch (selectedAsset.symbol) {
      case 'SOL':
        return <SolanaLogo key="solana" />;
      case 'mSOL':
        return <MarinadeLogo key="marinade" />;
    }
  };

  return (
    <Box height={400} width="100%" position="relative">
      {/* Background below */}
      <Box position="absolute" top={0} height={400} width="100%" zIndex={-1}>
        <Box position="relative" height={400} width="100%" overflow="hidden">
          <Box position="absolute" top={-2} width={600} right={right}>
            <AnimatePresence>{getLogo()}</AnimatePresence>
          </Box>
          <Box
            height={400}
            width="100%"
            position="absolute"
            bgGradient="linear(transparent 0%,  #131315 100%)"
          />
          {toShowSideFades && (
            <Box
              height={400}
              width="100%"
              position="absolute"
              bgGradient="linear(to-r, transparent 95%,  #131315 100%)"
            />
          )}
          {toShowSideFades && (
            <Box
              height={400}
              width="100%"
              position="absolute"
              bgGradient="linear(to-l, transparent 95%,  #131315 100%)"
            />
          )}
        </Box>
      </Box>
      {/* Content on top */}
      <Stack height={400} width="100%" justify="space-between" px={2}>
        <HStack mt={4} alignItems="flex-start" spacing="2">
          <RectangleButton
            isActive={selectedAsset.symbol === 'SOL'}
            onClick={() =>
              setSelectedAsset(
                ASSET_LIST.find((a) => a.symbol === 'SOL') as Asset
              )
            }
          >
            SOL
          </RectangleButton>
          <RectangleButton
            isActive={selectedAsset.symbol === 'bSOL'}
            onClick={() =>
              setSelectedAsset(
                ASSET_LIST.find((a) => a.symbol === 'bSOL') as Asset
              )
            }
          >
            bSOL
          </RectangleButton>
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
          <Text fontSize="6xl" color="#929292" lineHeight="90%">
            No Greed. No Fear.
          </Text>
          <HStack mt={4} spacing="2">
            <ConnectWalletButton />
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
        </Stack>
      </Stack>
    </Box>
  );
};
