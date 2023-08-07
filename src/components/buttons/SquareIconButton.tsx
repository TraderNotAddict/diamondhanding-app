import { IconButton, IconButtonProps } from '@chakra-ui/react';

interface SquareIconButtonProps extends IconButtonProps {}

export const SquareIconButton = (props: SquareIconButtonProps) => {
  return <IconButton {...props} borderRadius={0} />;
};
