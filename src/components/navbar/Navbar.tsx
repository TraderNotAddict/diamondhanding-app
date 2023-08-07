import {
  Box,
  Button,
  ButtonGroup,
  Container,
  HStack,
  useBreakpointValue,
  useDisclosure,
} from '@chakra-ui/react';
import { Logo } from './Logo';
import { MobileDrawer } from './MobileNavbar';
import { ToggleButton } from './ToggleButton';
import { RectangleButton } from '../buttons/RectangleButton';
import { SquareIconButton } from '../buttons/SquareIconButton';
import { GitHubIcon } from '../icons/GitHubIcon';
import { DiscordIcon } from '../icons/DiscordIcon';

export const Navbar = () => {
  const isDesktop = useBreakpointValue({ base: false, lg: true });
  const mobileNavbar = useDisclosure();
  return (
    <Box
      borderBottomWidth="1px"
      borderBottomColor="#212427"
      bg="bg.surface"
      position="sticky"
      zIndex="tooltip"
      marginBottom="4"
    >
      <Container py="2" maxWidth="100%">
        <HStack justify="space-between">
          <div>DH</div>
          {isDesktop ? (
            <HStack spacing="2">
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
              <RectangleButton>Connect Wallet</RectangleButton>
            </HStack>
          ) : (
            <>
              <ToggleButton
                onClick={mobileNavbar.onToggle}
                isOpen={mobileNavbar.isOpen}
                aria-label="Open Menu"
              />
              <MobileDrawer
                isOpen={mobileNavbar.isOpen}
                onClose={mobileNavbar.onClose}
              />
            </>
          )}
        </HStack>
      </Container>
    </Box>
  );
};
