import { Box, HStack, Stack, Text, useBreakpointValue } from "@chakra-ui/react";
import { SolanaLogo } from "./icons/SolanaLogo";
import { ConnectWalletButton } from "./buttons/ConnectWalletButton";
import { SquareIconButton } from "./buttons/SquareIconButton";
import { DiscordIcon } from "./icons/DiscordIcon";
import { GitHubIcon } from "./icons/GitHubIcon";
import { RectangleButton } from "./buttons/RectangleButton";

import { AnimatePresence } from "framer-motion";
import { MarinadeLogo } from "./icons/MarinadeLogo";
import { useHodlModalState, useSelectedAssetState } from "@/store";
import { ASSET_LIST, Asset } from "@/utils/constants/assets";
import { useWallet } from "@solana/wallet-adapter-react";
import { LockCarousel } from "./LockCarousel";
import { useEffect, useState } from "react";
import { UserAssetInfo } from "@/server/services/assets/retrieveAssetsByWalletAddress";
import { NewHoldModal } from "./modals/NewHoldModal";
import { PaperHandModal } from "./modals/PaperHandModal";
import { GitBookIcon } from "./icons/GitBookIcon";
import { BlazeLogo } from "./icons/BlazeLogo";
import { TetherLogo } from "./icons/TetherLogo";
import { USDCLogo } from "./icons/USDCLogo";

export const Hero = () => {
	const selectedAsset = useSelectedAssetState((state) => state.selectedAsset);
	const setSelectedAsset = useSelectedAssetState(
		(state) => state.setSelectedAsset
	);
	const right = useBreakpointValue({
		base: "0",
		md: "20",
	});
	const height = useBreakpointValue({
		base: 500,
		md: 450,
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
	const [showHodlModal, setShowHodlModal] = useHodlModalState((state) => [
		state.showHodlModal,
		state.setShowHodlModal,
	]);
	const [paperHandingAsset, setPaperHandingAsset] = useState<Asset | null>(
		null
	);
	const [isPaperHandModalOpen, setIsPaperHandModalOpen] = useState(false);

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
			case "SOL":
				return <SolanaLogo key="solana" />;
			case "bSOL":
				return <BlazeLogo key="blaze" />;
			case "mSOL":
				return <MarinadeLogo key="marinade" />;
			case "USDC":
				return <USDCLogo key="udsc" />;
			case "USDT":
				return <TetherLogo key="tether" />;
		}
	};

	const onUpdate = () => {
		setShowHodlModal(false);
		setIsPaperHandModalOpen(false);
		setIsLoading(true);
		fetch(`api/assets/${publicKey}`)
			.then((res) => {
				res.json().then((data) => {
					setAssets(data.userAssets as UserAssetInfo[]);
					setIsLoading(false);
				});
			})
			.catch(() => {
				setIsError(true);
				setIsLoading(false);
			});
	};

	const canStillHold = assets.some((a) => !a.hasOngoingSession);

	return (
		<>
			<Box height={height} width="100%" position="relative">
				{/* Background below */}
				<Box
					position="absolute"
					top={0}
					height={height}
					width="100%"
					zIndex={-1}
				>
					<Box
						position="relative"
						height={height}
						width="100%"
						overflow="hidden"
					>
						<Box position="absolute" top={-2} width={600} right={right}>
							<AnimatePresence>{getLogo()}</AnimatePresence>
						</Box>
						<Box
							height={height}
							width="100%"
							position="absolute"
							bgGradient="linear(transparent 0%,  #131315 100%)"
						/>
						{toShowSideFades && (
							<Box
								height={height}
								width="100%"
								position="absolute"
								bgGradient="linear(to-r, transparent 95%,  #131315 100%)"
							/>
						)}
						{toShowSideFades && (
							<Box
								height={height}
								width="100%"
								position="absolute"
								bgGradient="linear(to-l, transparent 95%,  #131315 100%)"
							/>
						)}
					</Box>
				</Box>
				{/* Content on top */}
				<Stack height={height} width="100%" justify="space-between" px={2}>
					<HStack mt={4} alignItems="flex-start" spacing="2">
						{ASSET_LIST.map((asset) => {
							return (
								<RectangleButton
									key={asset.mintAddress}
									isActive={selectedAsset.mintAddress === asset.mintAddress}
									onClick={() =>
										setSelectedAsset(
											ASSET_LIST.find(
												(a) => a.mintAddress === asset.mintAddress
											) as Asset
										)
									}
								>
									{asset.symbol}
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
								<RectangleButton
									onClick={() => setShowHodlModal(true)}
									isDisabled={!canStillHold}
								>
									{canStillHold ? "START NEW HODL" : "FULLY HANDED"}
								</RectangleButton>
							) : (
								<ConnectWalletButton />
							)}
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
						</HStack>
						<LockCarousel
							isLoading={isLoading}
							assets={assets.filter((a) => a.hasOngoingSession)}
							shouldShowAddButton={
								assets.filter((a) => !a.hasOngoingSession).length > 0
							}
							onAddButtonClick={() => setShowHodlModal(true)}
							onPaperHand={(asset) => {
								setPaperHandingAsset(asset);
								setIsPaperHandModalOpen(true);
							}}
							onWithdraw={onUpdate}
						/>
					</Stack>
				</Stack>
			</Box>
			<NewHoldModal
				defaultAsset={selectedAsset}
				userAssetInfo={assets}
				onHold={onUpdate}
			/>
			<PaperHandModal
				isOpen={isPaperHandModalOpen && paperHandingAsset != null}
				onClose={() => setIsPaperHandModalOpen(false)}
				asset={paperHandingAsset!}
				onPaperHand={onUpdate}
			/>
		</>
	);
};
