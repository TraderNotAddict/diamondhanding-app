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
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { Asset } from '@/utils/constants/assets';
import { UserAssetInfo } from '@/server/services/assets/retrieveAssetsByWalletAddress';
import { HoldButton } from '../buttons/HoldButton';
import { DateTime } from 'luxon';

interface Props {
  defaultAsset: Asset;
  isOpen: boolean;
  onClose: () => void;
  onHold: () => void | Promise<void>;
  userAssetInfo: UserAssetInfo[];
}

export const NewHoldModal = (props: Props) => {
  const [asset, setAsset] = useState<string>(props.defaultAsset.symbol);
  const [amount, setAmount] = useState<string>('1');
  const [unlockDate, setUnlockDate] = useState<Date>(
    DateTime.now().plus({ minutes: 5 }).toJSDate()
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const info = props.userAssetInfo.filter((a) => a.asset.symbol === asset)[0];
  const isAmountError = amount === '' || parseFloat(amount) <= 0;
  const isDateError = unlockDate <= new Date();

  // Reset amount when the asset changes
  useEffect(() => {
    setAmount('1');
  }, [asset]);

  if (info == null) {
    return null;
  }

  const formatDate = (date: Date): string =>
    `${date.toLocaleDateString().split('/').reverse().join('-')}T${date
      .toLocaleTimeString()
      .split(':')
      .slice(0, 2)
      .join(':')}`;

  return (
    <Modal
      isOpen={props.isOpen}
      onClose={props.onClose}
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
              onChange={(event) => setAsset(event.target.value)}
              isDisabled={isSubmitting}
              borderRadius={0}
            >
              {props.userAssetInfo
                .filter((a) => !a.hasOngoingSession)
                .map((a) => (
                  <option value={a.asset.symbol} key={a.asset.symbol}>
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
                Enter the amount you&apos;d like to hodl. Max:{' '}
                {info.walletBalance}
              </FormHelperText>
            ) : (
              <FormErrorMessage>Amount is invalid.</FormErrorMessage>
            )}
          </FormControl>

          <FormControl isInvalid={isDateError}>
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
        </ModalBody>

        <ModalFooter>
          <HoldButton
            asset={info.asset}
            amount={amount}
            unlockDate={unlockDate}
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
