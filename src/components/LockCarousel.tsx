import {
  Box,
  HStack,
  Heading,
  Stack,
  Tag,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react';
import Flicking from '@egjs/react-flicking';
import '@egjs/react-flicking/dist/flicking.css';
import { Ref, forwardRef, useEffect, useMemo, useState } from 'react';

import { motion } from 'framer-motion';
import { UserAssetInfo } from '@/server/services/assets/retrieveAssetsByWalletAddress';
import { renderDuration } from '@/utils/renderDuration';
import { AddIcon } from '@chakra-ui/icons';
import { DateTime } from 'luxon';
import { RectangleButton } from './buttons/RectangleButton';

interface PanelProps {
  asset: UserAssetInfo;
}

// eslint-disable-next-line react/display-name
const Panel = forwardRef((props: PanelProps, ref: Ref<HTMLDivElement>) => {
  const { asset } = props;

  const [countdown, setCountdown] = useState(
    Math.floor(asset.unlockDate! - DateTime.now().toSeconds())
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(Math.floor(asset.unlockDate! - DateTime.now().toSeconds()));
    }, 1000);

    return () => clearInterval(interval);
  }, [asset.unlockDate]);

  const width = useBreakpointValue({
    base: '300px',
    md: '30%',
  });

  const getBackgroundColor = () => {
    switch (asset.asset.symbol) {
      case 'SOL':
        return '#5ffbf1';
      case 'mSOL':
        return '#86a8e7';
    }
  };

  const getColor = () => {
    switch (asset.asset.symbol) {
      case 'SOL':
        return 'black';
      case 'mSOL':
        return '#86a8e7';
    }
  };

  return (
    <motion.div
      whileHover={{
        translateY: -5,
        transition: { duration: 0.1 },
      }}
      ref={ref}
      style={{
        width,
        borderColor: 'gray.700',
        borderRadius: 0,
        borderWidth: 1,
        padding: 16,
        marginRight: 12,
        cursor: 'pointer',
        marginTop: 5,
        marginBottom: 1,
        backgroundColor: '#131315',
        minHeight: 150,
      }}
    >
      <Stack alignItems="flex-start">
        <HStack>
          <Tag
            size="md"
            variant="solid"
            backgroundColor={getBackgroundColor()}
            borderRadius={0}
            fontWeight="bold"
            color={getColor()}
          >
            {asset.asset.symbol}
          </Tag>
          <Text color="gray.500">{asset.lockedBalance}</Text>
        </HStack>
        <Text fontSize="4xl" fontWeight="bold">
          {countdown <= 0 ? 'DIAMOND HANDED' : renderDuration(countdown)}
        </Text>
        <RectangleButton isDisabled={countdown > 0 && !asset.canManuallyUnlock}>
          {countdown <= 0
            ? 'UNHODL'
            : asset.canManuallyUnlock
            ? 'PAPER HAND'
            : 'DIAMOND HANDING'}
        </RectangleButton>
      </Stack>
    </motion.div>
  );
});

interface AddPanelProps {
  onClick: () => void | Promise<void>;
  isLoading: boolean;
}

// eslint-disable-next-line react/display-name
const AddPanel = forwardRef(
  (props: AddPanelProps, ref: Ref<HTMLDivElement>) => {
    const { onClick, isLoading } = props;

    const width = useBreakpointValue({
      base: '300px',
      md: '30%',
    });

    return (
      <Stack
        width={width}
        cursor={isLoading ? 'not-allowed' : 'pointer'}
        borderRadius={0}
        borderWidth={1}
        borderColor="gray.700"
        backgroundColor="#131315"
        marginTop={5}
        marginBottom={1}
        ref={ref}
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="159px"
        color="gray.700"
        transition="color 0.2s ease-in-out, border-color 0.2s ease-in-out"
        _hover={{
          borderColor: 'white',
          color: 'white',
        }}
        onClick={isLoading ? undefined : onClick}
      >
        <AddIcon />
        <Text>New HODL</Text>
      </Stack>
    );
  }
);

interface Props {
  isLoading: boolean;
  assets: UserAssetInfo[];
  shouldShowAddButton: boolean;
  onAddButtonClick: () => void;
}

export const LockCarousel = (props: Props) => {
  return (
    <Box mt={3} width="100%">
      <Flicking align="prev" circular={false}>
        {props.assets.map((asset) => (
          <Panel asset={asset} key={asset.asset.symbol} />
        ))}
        {(props.shouldShowAddButton || props.isLoading) && (
          <AddPanel
            isLoading={props.isLoading}
            onClick={props.onAddButtonClick}
            key={`${props.isLoading}-${props.shouldShowAddButton}`}
          />
        )}
      </Flicking>
    </Box>
  );
};
