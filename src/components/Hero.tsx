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
import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { MarinadeLogo } from './icons/MarinadeLogo';

enum Token {
  SOL,
  M_SOL,
}

export const Hero = () => {
  const [token, setToken] = useState(Token.SOL);

  const right = useBreakpointValue({
    base: '0',
    md: '20',
  });
  const toShowSideFades = useBreakpointValue({
    base: false,
    md: true,
  });

  const getLogo = () => {
    switch (token) {
      case Token.SOL:
        return <SolanaLogo key="solana" />;
      case Token.M_SOL:
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
            isActive={token === Token.SOL}
            onClick={() => setToken(Token.SOL)}
          >
            SOL
          </RectangleButton>
          <RectangleButton
            isActive={token === Token.M_SOL}
            onClick={() => setToken(Token.M_SOL)}
          >
            mSOL
          </RectangleButton>
        </HStack>
        <Stack alignItems="flex-start" spacing={0}>
          <Text fontSize="6xl" color="#929292" lineHeight="90%">
            Paper Hand?
          </Text>
          <Text fontSize="6xl" lineHeight="90%">
            <Highlight
              styles={{
                bgGradient: 'linear(to-r, #D16BA5, #86A8E7, #5FFBF1 80%)',
                bgClip: 'text',
                padding: 0,
              }}
              query="Diamond Handing"
            >
              Try Diamond Handing.
            </Highlight>
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
