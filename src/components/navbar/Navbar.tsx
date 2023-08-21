import {
	Box,
	Container,
	HStack,
	Image,
	useBreakpointValue,
	useDisclosure,
} from "@chakra-ui/react";
import { MobileDrawer } from "./MobileNavbar";
import { ToggleButton } from "./ToggleButton";
import { SquareIconButton } from "../buttons/SquareIconButton";
import { GitHubIcon } from "../icons/GitHubIcon";
import { DiscordIcon } from "../icons/DiscordIcon";
import { ConnectWalletButton } from "../buttons/ConnectWalletButton";
import { GitBookIcon } from "../icons/GitBookIcon";

export const Navbar = () => {
	const isDesktop = useBreakpointValue({ base: false, lg: true });
	const mobileNavbar = useDisclosure();
	return (
		<Box
			borderBottomWidth="1px"
			borderBottomColor="#212427"
			backgroundColor="#131315"
			bg="bg.surface"
			position="sticky"
			zIndex="tooltip"
		>
			<Container py="2" px="2" maxWidth="100%">
				<HStack justify="space-between">
					<div>
						<Image
							src={"/images/logo.png"}
							alt={"logo"}
							boxSize={8}
							maxW="none"
						/>
					</div>
					{isDesktop ? (
						<HStack spacing="2">
							<a
								href="https://guide.diamondhanding.io/"
								target="_blank"
								rel="noreferrer"
							>
								<SquareIconButton
									aria-label="GitBook"
									icon={<GitBookIcon />}
									variant="ghost"
								/>
							</a>
							<a
								href="https://github.com/diamondhanding"
								target="_blank"
								rel="noreferrer"
							>
								<SquareIconButton
									aria-label="GitHub"
									icon={<GitHubIcon />}
									variant="ghost"
								/>
							</a>
							<ConnectWalletButton />
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
