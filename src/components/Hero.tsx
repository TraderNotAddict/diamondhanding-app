import { Box, HStack, Stack, Text, useBreakpointValue } from "@chakra-ui/react";
import { SolanaLogo } from "./icons/SolanaLogo";
import { ConnectWalletButton } from "./buttons/ConnectWalletButton";
import { SquareIconButton } from "./buttons/SquareIconButton";
import { DiscordIcon } from "./icons/DiscordIcon";
import { GitHubIcon } from "./icons/GitHubIcon";
import { RectangleButton } from "./buttons/RectangleButton";
import { Show, Hide } from "@chakra-ui/react";

import { AnimatePresence } from "framer-motion";
import { MarinadeLogo } from "./icons/MarinadeLogo";
import { useHodlModalState, useAssetState } from "@/store";
import { ASSET_LIST, Asset } from "@/utils/constants/assets";
import { useWallet } from "@solana/wallet-adapter-react";
import { LockCarousel } from "./LockCarousel";
import { useEffect, useMemo, useState } from "react";
import { UserAssetInfo } from "@/server/services/assets/retrieveAssetsByWalletAddress";
import { NewHoldModal } from "./modals/NewHoldModal";
import { PaperHandModal } from "./modals/PaperHandModal";
import { GitBookIcon } from "./icons/GitBookIcon";
import { BlazeLogo } from "./icons/BlazeLogo";
import { TetherLogo } from "./icons/TetherLogo";
import { USDCLogo } from "./icons/USDCLogo";
import React from "react";
import { useDataFetch } from "@/utils/useDataFetch";
import { mutate } from "swr";

export const Hero = () => {
	const [
		selectedAsset,
		setSelectedAsset,
		userAssets,
		setUserAssets,
		isGlobalLoading,
		setIsGlobalLoading,
	] = useAssetState((state) => [
		state.selectedAsset,
		state.setSelectedAsset,
		state.userAssets,
		state.setUserAssets,
		state.isGlobalLoading,
		state.setIsGlobalLoading,
	]);

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
	const { publicKey, connecting, connected, disconnecting } = useWallet();

	const prevPublickKey = React.useRef<string>(publicKey?.toBase58() || "");

	// Reset the state if wallet changes or disconnects
	React.useEffect(() => {
		if (publicKey && publicKey.toBase58() !== prevPublickKey.current) {
			prevPublickKey.current = publicKey.toBase58();
		}
		setUserAssets([]);
		setIsGlobalLoading(true);
	}, [publicKey, disconnecting, setUserAssets, setIsGlobalLoading]);

	const [showHodlModal, setShowHodlModal] = useHodlModalState((state) => [
		state.showHodlModal,
		state.setShowHodlModal,
	]);
	const [paperHandingAsset, setPaperHandingAsset] = useState<Asset | null>(
		null
	);
	const [isPaperHandModalOpen, setIsPaperHandModalOpen] = useState(false);
	const [canStillHold, setCanStillHold] = useState(false);

	const { data: { userAssets: fetchedUserAssets } = {}, error } = useDataFetch<{
		userAssets: Array<UserAssetInfo>;
	}>(publicKey ? `/api/assets/${publicKey}` : null);

	React.useEffect(() => {
		if (fetchedUserAssets) {
			setUserAssets(fetchedUserAssets);
			const assetWithOngoingSession = fetchedUserAssets.find(
				(a) => a.hasOngoingSession
			);
			if (assetWithOngoingSession) {
				setSelectedAsset(assetWithOngoingSession.asset);
			}
			setCanStillHold(fetchedUserAssets.some((a) => !a.hasOngoingSession));
		}
	}, [fetchedUserAssets, setUserAssets, setSelectedAsset]);

	const logo = useMemo(() => {
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
	}, [selectedAsset.symbol]);

	const onUpdate = () => {
		setShowHodlModal(false);
		setIsPaperHandModalOpen(false);
		mutate(`/api/assets/${publicKey}`);
	};

	useEffect(() => {
		setIsGlobalLoading(connected && (!userAssets || userAssets.length === 0));
	}, [connected, userAssets, setIsGlobalLoading]);

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
							<Show above="md">
								<AnimatePresence>{logo}</AnimatePresence>
							</Show>
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
									isDisabled={!canStillHold || isGlobalLoading}
								>
									{isGlobalLoading
										? "Checking Assets"
										: canStillHold
										? "START NEW HODL"
										: "FULLY HANDED"}
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
			<NewHoldModal onHold={onUpdate} />
			<PaperHandModal
				isOpen={isPaperHandModalOpen && paperHandingAsset != null}
				onClose={() => setIsPaperHandModalOpen(false)}
				asset={paperHandingAsset!}
				onPaperHand={onUpdate}
			/>
		</>
	);
};
