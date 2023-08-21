import {
	Drawer,
	DrawerBody,
	DrawerContent,
	DrawerProps,
	HStack,
	Stack,
} from "@chakra-ui/react";
import { DiscordIcon } from "../icons/DiscordIcon";
import { SquareIconButton } from "../buttons/SquareIconButton";
import { GitHubIcon } from "../icons/GitHubIcon";
import { ConnectWalletButton } from "../buttons/ConnectWalletButton";
import { GitBookIcon } from "../icons/GitBookIcon";

export const MobileDrawer = (props: Omit<DrawerProps, "children">) => (
	<Drawer placement="top" {...props}>
		<DrawerContent>
			<DrawerBody mt="12" mb="2" px="4">
				<Stack spacing="4" align="stretch">
					<ConnectWalletButton />
					<HStack spacing="4" justifyContent="center">
						<a
							href="https://guide.diamondhanding.io/"
							target="_blank"
							rel="noreferrer"
						>
							<SquareIconButton aria-label="Discord" icon={<GitBookIcon />} />
						</a>
						<a
							href="https://github.com/diamondhanding"
							target="_blank"
							rel="noreferrer"
						>
							<SquareIconButton aria-label="GitHub" icon={<GitHubIcon />} />
						</a>
					</HStack>
				</Stack>
			</DrawerBody>
		</DrawerContent>
	</Drawer>
);
