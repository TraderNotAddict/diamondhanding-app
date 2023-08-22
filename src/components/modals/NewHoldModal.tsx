import {
	FormControl,
	FormErrorMessage,
	FormHelperText,
	FormLabel,
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
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { ASSET_LIST, Asset } from "@/utils/constants/assets";
import { UserAssetInfo } from "@/server/services/assets/retrieveAssetsByWalletAddress";
import { HoldButton } from "../buttons/HoldButton";
import { DateTime } from "luxon";
import { RectangleButton } from "../buttons/RectangleButton";
import { useHodlModalState, useAssetState } from "@/store";

interface Props {
	onHold: () => void | Promise<void>;
}

export const NewHoldModal = (props: Props) => {
	const [selectedAsset, setSelectedAsset, userAssets, setUserAssets] =
		useAssetState((state) => [
			state.selectedAsset,
			state.setSelectedAsset,
			state.userAssets,
			state.setUserAssets,
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
	const [isSubmitting, setIsSubmitting] = useState(false);

	const info = userAssets.filter(
		(a) => a.asset.mintAddress === selectedAsset.mintAddress
	)[0];
	const isAmountError = amount === "" || parseFloat(amount) <= 0;
	const isDateError = unlockDate <= new Date();
	const validAssets = userAssets.filter((a) => !a.hasOngoingSession);

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
		}
	}, [showHodlModal, validAssets, selectedAsset, setSelectedAsset]);

	// Reset amount when the asset changes
	useEffect(() => {
		setAmount("1");
	}, [selectedAsset]);

	if (info == null) {
		return null;
	}

	const availableBalance = info.walletBalance / 10 ** info.asset.decimals;

	return (
		<Modal
			isOpen={showHodlModal}
			onClose={() => setShowHodlModal(false)}
			isCentered
			closeOnOverlayClick={false}
			allowPinchZoom={true}
		>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Create New Hodl</ModalHeader>
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
							isDisabled={isSubmitting}
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
							isDisabled={isSubmitting}
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
						>
							<NumberInputField borderRadius={0} />
						</NumberInput>
						{!isAmountError ? (
							<FormHelperText>
								Enter the amount you&apos;d like to hodl.{" "}
								<span
									style={{ cursor: "pointer" }}
									onClick={() =>
										setAmount(
											(info.asset.type === "native_token"
												? availableBalance - 0.0026 > 0
													? availableBalance - 0.0026
													: 0
												: availableBalance
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
							isDisabled={isSubmitting}
							type="datetime-local"
							value={DateTime.fromJSDate(unlockDate).toFormat(
								"yyyy-MM-dd'T'HH:mm"
							)}
							// min={formatDate(new Date())}
							onChange={(event) => setUnlockDate(new Date(event.target.value))}
						/>
						{!isDateError ? (
							<FormHelperText>
								Enter the date time by which you&apos;d want to unhodl.
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
							onClick={() => setEnableDiamondHand((e) => !e)}
						>
							{enabledDiamondHand ? "Enabled" : "Disabled"}
						</RectangleButton>
						<FormHelperText>
							This means you won&apos;t be allowed to paper hand!
						</FormHelperText>
					</FormControl>
				</ModalBody>

				<ModalFooter>
					<HoldButton
						asset={info.asset}
						amount={amount}
						unlockDate={unlockDate}
						canManuallyUnlock={!enabledDiamondHand}
						isLoading={isSubmitting}
						setIsLoading={setIsSubmitting}
						onSuccess={() => props.onHold()}
						isDisabled={isAmountError || isDateError}
					/>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};
