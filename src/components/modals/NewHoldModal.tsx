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
import { useHodlModalState, useSelectedAssetState } from "@/store";

interface Props {
	defaultAsset: Asset;
	onHold: () => void | Promise<void>;
	userAssetInfo: UserAssetInfo[];
}

export const NewHoldModal = (props: Props) => {
	const selectedAsset = useSelectedAssetState((state) => state.selectedAsset);
	const setSelectedAsset = useSelectedAssetState(
		(state) => state.setSelectedAsset
	);
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

	const info = props.userAssetInfo.filter(
		(a) => a.asset.mintAddress === selectedAsset.mintAddress
	)[0];
	const isAmountError = amount === "" || parseFloat(amount) <= 0;
	const isDateError = unlockDate <= new Date();
	const validAssets = props.userAssetInfo.filter((a) => !a.hasOngoingSession);

	useEffect(() => {
		if (!validAssets || validAssets.length === 0) {
			return;
		}
		if (
			!validAssets?.find(
				(a) => a.asset.mintAddress === selectedAsset.mintAddress
			) &&
			showHodlModal
		) {
			setSelectedAsset(validAssets[0].asset);
		}
	}, [showHodlModal, validAssets, selectedAsset, setSelectedAsset]);

	// Reset amount when the asset changes
	useEffect(() => {
		setAmount("1");
	}, [selectedAsset]);

	if (info == null) {
		return null;
	}

	const formatDate = (date: Date): string =>
		`${date.toLocaleDateString().split("/").reverse().join("-")}T${date
			.toLocaleTimeString()
			.split(":")
			.slice(0, 2)
			.join(":")}`;

	return (
		<Modal
			isOpen={showHodlModal}
			onClose={() => setShowHodlModal(false)}
			isCentered
			closeOnOverlayClick={false}
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
								Enter the amount you&apos;d like to hodl. Max:{" "}
								{info.walletBalance / 10 ** info.asset.decimals}
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
							value={formatDate(unlockDate)}
							min={formatDate(new Date())}
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
