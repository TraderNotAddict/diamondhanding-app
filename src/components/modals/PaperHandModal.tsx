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
  Text,
} from '@chakra-ui/react';
import { useState } from 'react';
import { Asset } from '@/utils/constants/assets';
import { WithdrawButton } from '../lock-assets/WithdrawButton';

interface Props {
  asset: Asset;
  isOpen: boolean;
  onClose: () => void;
  onPaperHand: () => void | Promise<void>;
}

export const PaperHandModal = (props: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <Modal
      isOpen={props.isOpen}
      onClose={() => {
        if (isSubmitting) return;
        props.onClose();
      }}
      isCentered
      closeOnOverlayClick={false}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Paper Hand?</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>
            Are you sure you wish to paper hand? You will get back all of your
            assets.
          </Text>
        </ModalBody>

        <ModalFooter>
          <WithdrawButton
            asset={props.asset}
            isLoading={isSubmitting}
            setIsLoading={setIsSubmitting}
            onSuccess={() => props.onPaperHand()}
            text="Paper Hand!"
          />
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
