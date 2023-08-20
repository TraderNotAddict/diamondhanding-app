import { Box, Card } from '@chakra-ui/react';
import Flicking from '@egjs/react-flicking';
import '@egjs/react-flicking/dist/flicking.css';
import { LegacyRef, forwardRef } from 'react';

interface PanelProps {
  isLoading: boolean;
  index: number;
}

// eslint-disable-next-line react/display-name
const Panel = forwardRef(
  (props: PanelProps, ref: LegacyRef<HTMLDivElement>) => {
    return <Card ref={ref}>Placeholder {props.index}</Card>;
  }
);

export const LockCarousel = () => {
  return (
    <Box mx={2} my={6}>
      <Flicking align="prev" circular={false}>
        <Panel index={1} isLoading={false} />
        <Panel index={2} isLoading={false} />
        <Panel index={3} isLoading={false} />
      </Flicking>
    </Box>
  );
};
