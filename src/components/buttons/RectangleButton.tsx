import { Button, ButtonProps, Text } from '@chakra-ui/react';

export interface RectangleButtonProps
  extends Omit<
    ButtonProps,
    '_before' | 'borderRadius' | 'px' | 'py' | '_hover' | '_active'
  > {}

export const RectangleButton = (props: RectangleButtonProps) => {
  return (
    <Button
      {...props}
      _before={{
        position: 'absolute',
        content: `""`,
        width: '100%',
        height: '100%',
        // bgGradient: 'linear(to-r, #335899, #5E93EA, #9094d1 80%)',
        bgGradient: 'linear(to-r, #D16BA5, #86A8E7, #5FFBF1 80%)',
        transition: '0.4s',
        opacity: 0,
      }}
      borderRadius={0}
      px={5}
      py={0}
      _hover={{
        _before: { opacity: 1 },
        color: '#131315',
      }}
      _active={{
        _before: { opacity: 1 },
        color: '#131315',
      }}
    >
      <Text zIndex={1}>{props.children}</Text>
    </Button>
  );
};
