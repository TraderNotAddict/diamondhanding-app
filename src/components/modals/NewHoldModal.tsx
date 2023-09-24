import {
	Box,
	FormControl,
	FormErrorMessage,
	FormHelperText,
	FormLabel,
	HStack,
	Hide,
	Image,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	NumberInput,
	NumberInputField,
	Select,
	Show,
	Stack,
	Text,
	useBreakpointValue,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { ASSET_LIST, Asset } from "@/utils/constants/assets";
import { UserAssetInfo } from "@/server/services/assets/retrieveAssetsByWalletAddress";
import { HoldButton } from "../buttons/HoldButton";
import { DateTime } from "luxon";
import { RectangleButton } from "../buttons/RectangleButton";
import { useHodlModalState, useAssetState } from "@/store";
import { getGeometryFromValueAndDuration } from "@/utils/getGeometryFromValueAndDuration";
import { geometryImages } from "@/utils/constants/images";

interface Props {
	onHold: () => void | Promise<void>;
}

export const NewHoldModal = (props: Props) => {
	const [
		selectedAsset,
		setSelectedAsset,
		userAssets,
		setUserAssets,
		isGlobalLoading,
	] = useAssetState((state) => [
		state.selectedAsset,
		state.setSelectedAsset,
		state.userAssets,
		state.setUserAssets,
		state.isGlobalLoading,
	]);

	const [showHodlModal, setShowHodlModal] = useHodlModalState((state) => [
		state.showHodlModal,
		state.setShowHodlModal,
	]);
	const [amount, setAmount] = useState<string>("1");
	const [unlockDate, setUnlockDate] = useState<Date>(
		DateTime.now().plus({ minutes: 5 }).toJSDate()
	);
	const [enabledDiamondHand, setEnableDiamondHand] = useState(false);
	const [isExampleShown, setIsExampleShown] = useState(false);
	const useExampleModal = useBreakpointValue({
		base: false,
		md: true,
	});

	const info = userAssets.filter(
		(a) => a.asset.mintAddress === selectedAsset.mintAddress
	)[0];
	const isDateError =
		unlockDate <= DateTime.now().plus({ minutes: 1 }).toJSDate();
	const validAssets = userAssets.filter(
		(a) => !a.hasOngoingSession || (a.hasOngoingSession && !a.canManuallyUnlock)
	);

	useEffect(() => {
		if (!validAssets || validAssets.length === 0) {
			return;
		}
		if (showHodlModal) {
			if (
				!validAssets?.find(
					(a) => a.asset.mintAddress === selectedAsset.mintAddress
				)
			) {
				setSelectedAsset(validAssets[0].asset);
			}
			if (info.hasOngoingSession) {
				setUnlockDate(
					DateTime.fromMillis((info.unlockDate ?? 0) * 1000).toJSDate()
				);
				setEnableDiamondHand(!info.canManuallyUnlock);
			}
		}
	}, [showHodlModal, validAssets, selectedAsset, setSelectedAsset, info]);

	// Reset amount when the asset changes
	useEffect(() => {
		setAmount("0");
	}, [selectedAsset]);

	const geometry = getGeometryFromValueAndDuration({
		valueInUsd:
			(info?.priceinUSDC ?? 0) *
			(Number.isNaN(parseFloat(amount)) ? 0 : parseFloat(amount)),
		durationInSeconds:
			DateTime.fromJSDate(unlockDate).toSeconds() - DateTime.now().toSeconds(),
	});
	const image = useMemo(
		() => geometryImages[geometry][Math.floor(Math.random() * 20) + 1],
		[geometry]
	);

	const availableBalance =
		(info?.walletBalance ?? 0) / 10 ** (info?.asset?.decimals ?? 0);
	const isAmountError = useMemo(() => {
		return (
			amount === "" ||
			Number.isNaN(parseFloat(amount)) ||
			parseFloat(amount) < 0 ||
			parseFloat(amount) > availableBalance
		);
	}, [amount, availableBalance]);

	if (!info) {
		return null;
	}

	return (
		<Modal
			isOpen={showHodlModal}
			onClose={() => setShowHodlModal(false)}
			isCentered
			closeOnOverlayClick={false}
			allowPinchZoom={true}
		>
			<ModalOverlay />
			{useExampleModal && (
				<ModalContent
					pointerEvents="initial"
					translateX={5}
					transform="auto"
					sx={{
						transform: isExampleShown
							? "translate(200px, 0px)!important"
							: "translate(40px, 0px)!important",
						transition: "transform 0.6s ease-in-out",
					}}
				>
					<HStack justifyContent="flex-end">
						<Stack>
							<Image
								src={image["imageUrl"]}
								alt={geometry}
								loading="lazy"
								boxSize={40}
								my={2.5}
								maxW="none"
							/>
							<Text style={{ textAlign: "center" }}>{geometry} Tier</Text>
						</Stack>
						<Text
							sx={{ writingMode: "vertical-rl", cursor: "pointer" }}
							my={4}
							mr={2}
							color="whiteAlpha.600"
							onClick={() => setIsExampleShown((i) => !i)}
						>
							EXAMPLE MEMENTO
						</Text>
					</HStack>
				</ModalContent>
			)}

			<ModalContent pointerEvents="initial">
				<ModalHeader>
					{info.hasOngoingSession ? "Top-up" : "Create New Hodl"}
				</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<FormControl mb={4}>
						<FormLabel fontWeight="bold">Asset</FormLabel>
						<Select
							onChange={(event) =>
								setSelectedAsset(
									ASSET_LIST.find(
										(a) => a.mintAddress === event.target.value
									) as Asset
								)
							}
							isDisabled={isGlobalLoading}
							defaultValue={selectedAsset.mintAddress}
							borderRadius={0}
						>
							{validAssets.map((a) => (
								<option value={a.asset.mintAddress} key={a.asset.mintAddress}>
									{a.asset.name}
								</option>
							))}
						</Select>
					</FormControl>
					<FormControl isInvalid={isAmountError} mb={4}>
						<FormLabel fontWeight="bold">Amount</FormLabel>
						<NumberInput
							isDisabled={isGlobalLoading}
							min={0}
							max={info.walletBalance}
							value={amount}
							precision={info.asset.decimals}
							onChange={(value) => {
								if (!value) {
									setAmount("");
								} else {
									setAmount(value);
								}
							}}
							onBlur={() => {
								if (amount === "") {
									setAmount("0");
								}
							}}
						>
							<NumberInputField borderRadius={0} />
						</NumberInput>
						{!isAmountError ? (
							<FormHelperText>
								Enter the amount you&apos;d like to{" "}
								{info.hasOngoingSession ? "top-up" : "hodl"}.{" "}
								<span
									style={{ cursor: "pointer" }}
									onClick={() =>
										setAmount(
											(info.asset.type === "native_token"
												? availableBalance - 0.0026 > 0
													? Math.round(
															(availableBalance - 0.0026) *
																10 ** info.asset.decimals
													  ) /
													  10 ** info.asset.decimals
													: 0
												: Math.round(
														availableBalance * 10 ** info.asset.decimals
												  ) /
												  10 ** info.asset.decimals
											).toString()
										)
									}
								>
									Max: {availableBalance}
								</span>
							</FormHelperText>
						) : (
							<FormErrorMessage>Amount is invalid.</FormErrorMessage>
						)}
					</FormControl>

					<FormControl isInvalid={isDateError} mb={4}>
						<FormLabel fontWeight="bold">Unhodl At</FormLabel>
						<Input
							borderRadius={0}
							isDisabled={isGlobalLoading || info.hasOngoingSession}
							type="datetime-local"
							value={DateTime.fromJSDate(unlockDate).toFormat(
								"yyyy-MM-dd'T'HH:mm"
							)}
							// min={formatDate(new Date())}
							onChange={(event) => setUnlockDate(new Date(event.target.value))}
						/>
						{!isDateError ? (
							<FormHelperText>
								{info.hasOngoingSession
									? "You can't change this now."
									: "Enter the date time by which you'd want to unhodl."}
							</FormHelperText>
						) : (
							<FormErrorMessage>
								Date time needs to be in the future.
							</FormErrorMessage>
						)}
					</FormControl>

					<FormControl>
						<FormLabel fontWeight="bold">Enable Diamond Handing</FormLabel>
						<RectangleButton
							isActive={enabledDiamondHand}
							isDisabled={isGlobalLoading || info.hasOngoingSession}
							onClick={() => setEnableDiamondHand((e) => !e)}
						>
							{enabledDiamondHand ? "Enabled" : "Disabled"}
						</RectangleButton>
						<FormHelperText>
							This means you won&apos;t be allowed to paper hand!
						</FormHelperText>
					</FormControl>

					<Show breakpoint="(min-height: 700px)">
						{!useExampleModal && (
							<Stack mt={4} alignItems="center">
								<Text fontWeight="bold" fontSize="md">
									Example Memento - {geometry} Tier
								</Text>
								<Image
									src={image["imageUrl"]}
									alt={geometry}
									loading="lazy"
									boxSize={20}
									maxW="none"
								/>
							</Stack>
						)}
					</Show>
				</ModalBody>

				<ModalFooter>
					<HoldButton
						asset={info.asset}
						amount={amount}
						unlockDate={unlockDate}
						canManuallyUnlock={!enabledDiamondHand}
						onSuccess={() => props.onHold()}
						isDisabled={isAmountError || isDateError}
					/>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};
