import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { RectangleButton } from '../buttons/RectangleButton';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const NewHoldModal = (props: Props) => {
  return (
    <Modal
      isOpen={props.isOpen}
      onClose={props.onClose}
      isCentered
      closeOnOverlayClick={false}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Modal Title</ModalHeader>
        <ModalCloseButton />
        <ModalBody>Test</ModalBody>

        <ModalFooter>
          <RectangleButton>HOLD</RectangleButton>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
