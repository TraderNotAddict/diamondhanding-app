import {
  Box,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
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
  Stack,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { ASSET_LIST, Asset } from '@/utils/constants/assets';
import { UserAssetInfo } from '@/server/services/assets/retrieveAssetsByWalletAddress';
import { HoldButton } from '../buttons/HoldButton';
import { DateTime } from 'luxon';
import { RectangleButton } from '../buttons/RectangleButton';
import { useHodlModalState, useAssetState } from '@/store';
import { getGeometryFromValueAndDuration } from '@/utils/getGeometryFromValueAndDuration';
import { geometryImages } from '@/utils/constants/images';

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
  const [amount, setAmount] = useState<string>('1');
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
    setAmount('1');
  }, [selectedAsset]);

  const geometry = getGeometryFromValueAndDuration({
    valueInUsd:
      (info?.asset?.price ?? 0) *
      (Number.isNaN(parseFloat(amount)) ? 0 : parseFloat(amount)),
    durationInSeconds:
      DateTime.fromJSDate(unlockDate).toSeconds() - DateTime.now().toSeconds(),
  });
  const image = useMemo(
    () => geometryImages[geometry][Math.floor(Math.random() * 20) + 1],
    [geometry]
  );

  if (info == null) {
    return null;
  }

  const availableBalance = info.walletBalance / 10 ** info.asset.decimals;
  const isAmountError =
    amount === '' ||
    Number.isNaN(parseFloat(amount)) ||
    parseFloat(amount) <= 0 ||
    parseFloat(amount) > availableBalance;

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
              ? 'translate(200px, 0px)!important'
              : 'translate(40px, 0px)!important',
            transition: 'transform 0.6s ease-in-out',
          }}
        >
          <HStack justifyContent="flex-end">
            <Image
              src={image['imageUrl']}
              alt={geometry}
              loading="lazy"
              boxSize={40}
              my={4}
              maxW="none"
            />
            <Text
              sx={{ writingMode: 'vertical-rl', cursor: 'pointer' }}
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
                  setAmount('');
                } else {
                  setAmount(value);
                }
              }}
            >
              <NumberInputField borderRadius={0} />
            </NumberInput>
            {!isAmountError ? (
              <FormHelperText>
                Enter the amount you&apos;d like to hodl.{' '}
                <span
                  style={{ cursor: 'pointer' }}
                  onClick={() =>
                    setAmount(
                      (info.asset.type === 'native_token'
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
              isDisabled={isGlobalLoading}
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
              {enabledDiamondHand ? 'Enabled' : 'Disabled'}
            </RectangleButton>
            <FormHelperText>
              This means you won&apos;t be allowed to paper hand!
            </FormHelperText>
          </FormControl>

          {!useExampleModal && (
            <Stack mt={4} alignItems="center">
              <Text fontWeight="bold" fontSize="md">
                Example Memento
              </Text>
              <Image
                src={image['imageUrl']}
                alt={geometry}
                loading="lazy"
                boxSize={32}
                maxW="none"
              />
            </Stack>
          )}
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
