import {
  Box,
  ButtonGroup,
  HStack,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Spinner,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useBreakpointValue,
} from '@chakra-ui/react';
import { SearchIcon, StarIcon } from '@chakra-ui/icons';
import { IMemento } from '@/models/memento';
import { Duration } from 'luxon';
import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';
import { Button } from './Button';
import { RectangleButton } from './buttons/RectangleButton';
import { useSelectedAssetState } from '@/store';
import { ConnectWalletButton } from './buttons/ConnectWalletButton';
import { renderDuration } from '@/utils/renderDuration';

// Stateful component
export const MementoTable = () => {
  const selectedAsset = useSelectedAssetState((state) => state.selectedAsset);
  const [mementos, setMementos] = useState<IMemento[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const { publicKey, connecting, connected } = useWallet();
  const [hasStartedConnecting, setHasStartedConnecting] = useState(false);
  const [favourites, setFavourites] = useState(new Set<string>()); // Temp implementation
  const [filterFavourites, setFilterFavourites] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const searchMaxWidth = useBreakpointValue({
    base: '100%',
    md: '50%',
  });
  const [isTable, setIsTable] = useState(true);

  useEffect(() => {
    let didCancel = false;

    if (
      !connecting &&
      !hasStartedConnecting &&
      !(connected && mementos.length === 0) // Adding this condition to support hot reload
    ) {
      setTimeout(() => {
        // If after some time, we still have not started connecting, then we'll stop loading.
        if (!didCancel) {
          setIsLoading(false);
        }
      }, 500);
      return () => {
        didCancel = true;
      };
    }
    if (connecting) {
      setHasStartedConnecting(true);
      return;
    }
    if (publicKey == null) {
      setIsLoading(false);
      return;
    }

    fetch(`/api/memento/${publicKey}`)
      .then((res) => {
        res.json().then((data) => {
          if (!didCancel) {
            setMementos(data.userMementos as IMemento[]);
            setIsLoading(false);
          }
        });
      })
      .catch(() => {
        if (!didCancel) {
          setIsError(true);
          setIsLoading(false);
        }
      });
    return () => {
      didCancel = true;
    };
  }, [publicKey, connecting, hasStartedConnecting, connected, mementos.length]);

  if (isLoading) {
    return (
      <Box
        mx={2}
        my={6}
        justifyContent="center"
        alignItems="center"
        display="flex"
        width="100%"
      >
        <Spinner size="lg" />
      </Box>
    );
  }

  const getHeaders = () => {
    return (
      <Thead>
        <Tr>
          <Th>
            <StarIcon
              boxSize={4}
              color={filterFavourites ? 'yellow.100' : 'grey'}
              _hover={{
                cursor: 'pointer',
              }}
              onClick={() => setFilterFavourites((f) => !f)}
            />
          </Th>
          <Th fontFamily="inherit">
            <Text fontSize="md" fontWeight="bold">
              MEMENTO
            </Text>
          </Th>
          <Th fontFamily="inherit">
            <Text fontSize="md" fontWeight="bold">
              TOKEN
            </Text>
          </Th>
          <Th fontFamily="inherit">
            <Text fontSize="md" fontWeight="bold">
              VALUE
            </Text>
          </Th>
          <Th fontFamily="inherit">
            <Text fontSize="md" fontWeight="bold">
              DURATION
            </Text>
          </Th>
          <Th fontFamily="inherit">
            <Text fontSize="md" fontWeight="bold">
              INITIATIVE
            </Text>
          </Th>
        </Tr>
      </Thead>
    );
  };

  if (!connected || mementos.length === 0) {
    return (
      <Stack px={2} py={6} alignItems="center" width="100%" position="relative">
        <HStack width={searchMaxWidth}>
          <InputGroup maxWidth="100%">
            <InputLeftElement>
              <SearchIcon boxSize={4} />
            </InputLeftElement>
            <Input
              width="full"
              fontSize="sm"
              variant="filled"
              type="text"
              placeholder="What are you looking for?"
              autoComplete="off"
              borderRadius={0}
              isDisabled
            />
          </InputGroup>
          <ButtonGroup isDisabled>
            <RectangleButton isActive={false}>CARD</RectangleButton>
            <RectangleButton isActive onClick={() => setIsTable(false)}>
              TABLE
            </RectangleButton>
          </ButtonGroup>
        </HStack>
        <Box overflowX="auto" width="100%">
          <Table>
            {getHeaders()}
            <Tbody>
              <Tr>
                <Td borderBottom="None">
                  <HStack>
                    <StarIcon
                      boxSize={4}
                      color="transparent"
                      focusable
                      stroke="grey"
                      strokeWidth={2}
                    />
                    <Text fontSize="md" fontWeight="medium">
                      1
                    </Text>
                  </HStack>
                </Td>
                <Td py={1} borderBottom="None">
                  <HStack spacing={3}>
                    <Image
                      src="https://bafybeihmqkcwifzpisudjtcwpipgno4rn5kaxuackmf2zcl2uhtxwytrpy.ipfs.nftstorage.link/portal_APeirtqa6y_fQwnm0e5Nf.png"
                      alt="Mystery Memento"
                      boxSize={14}
                      maxW="none"
                    />
                    <Text fontSize="md" fontWeight="medium">
                      Mystery Memento
                    </Text>
                  </HStack>
                </Td>
                <Td borderBottom="None">
                  <Text fontSize="md" fontWeight="medium">
                    {selectedAsset.symbol}
                  </Text>
                </Td>
                <Td borderBottom="None">
                  <Text fontSize="md" fontWeight="medium">
                    ?
                  </Text>
                </Td>
                <Td borderBottom="None">
                  <Text fontSize="md" fontWeight="medium">
                    {renderDuration(60)}
                  </Text>
                </Td>
                <Td borderBottom="None">
                  <Text fontSize="md" fontWeight="medium">
                    ?
                  </Text>
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </Box>
        <Box
          position="absolute"
          bottom={-2}
          bgGradient="linear(transparent 50%, #131315 75%)"
          width="100%"
          height="100%"
          display="flex"
          justifyContent="center"
          alignItems="flex-end"
        >
          {!connected && <ConnectWalletButton />}
          {mementos.length !== 0 && (
            <RectangleButton>Unlock your first memento now!</RectangleButton>
          )}
        </Box>
      </Stack>
    );
  }

  const updateFavourites = (id: string) => {
    const newFavourites = new Set(favourites);
    if (newFavourites.has(id)) {
      newFavourites.delete(id);
      setFavourites(newFavourites);
    } else {
      newFavourites.add(id);
      setFavourites(newFavourites);
    }
  };

  return (
    <Stack px={2} py={6} alignItems="center" width="100%">
      <HStack width={searchMaxWidth}>
        <InputGroup maxWidth="100%">
          <InputLeftElement>
            <SearchIcon boxSize={4} />
          </InputLeftElement>
          <Input
            width="full"
            fontSize="sm"
            variant="filled"
            type="text"
            placeholder="What are you looking for?"
            autoComplete="off"
            borderRadius={0}
          />
        </InputGroup>
        <ButtonGroup>
          <RectangleButton
            isActive={!isTable}
            onClick={() => setIsTable(false)}
          >
            GALLERY
          </RectangleButton>
          <RectangleButton isActive={isTable} onClick={() => setIsTable(true)}>
            TABLE
          </RectangleButton>
        </ButtonGroup>
      </HStack>
      <Box overflowX="auto" width="100%">
        {isTable && (
          <Table>
            {getHeaders()}
            <Tbody>
              {mementos
                .filter(
                  (memento) => !filterFavourites || favourites.has(memento._id!)
                )
                .map((memento, index) => {
                  return (
                    <Tr
                      key={memento._id}
                      _hover={{
                        backgroundColor: 'gray.900',
                        cursor: 'pointer',
                      }}
                    >
                      <Td borderBottom="None">
                        <HStack>
                          {favourites.has(memento._id!) ? (
                            <StarIcon
                              boxSize={4}
                              focusable
                              onClick={() => updateFavourites(memento._id!)}
                              color="yellow.100"
                              _hover={{ cursor: 'pointer' }}
                            />
                          ) : (
                            <StarIcon
                              boxSize={4}
                              color="transparent"
                              focusable
                              onClick={() => updateFavourites(memento._id!)}
                              stroke="grey"
                              strokeWidth={2}
                              _hover={{
                                stroke: 'yellow.100',
                                cursor: 'pointer',
                              }}
                            />
                          )}
                          <Text fontSize="md" fontWeight="medium">
                            {index + 1}
                          </Text>
                        </HStack>
                      </Td>
                      <Td py={1} borderBottom="None">
                        <HStack spacing={3}>
                          <Image
                            src={memento.image}
                            alt={memento.name}
                            boxSize={14}
                            maxW="none"
                          />
                          <Text fontSize="md" fontWeight="medium">
                            {memento.name}
                          </Text>
                        </HStack>
                      </Td>
                      <Td borderBottom="None">
                        <Text fontSize="md" fontWeight="medium">
                          {memento.typeOfNft}
                        </Text>
                      </Td>
                      <Td borderBottom="None">
                        <Text fontSize="md" fontWeight="medium">
                          {memento.quantityLocked}
                        </Text>
                      </Td>
                      <Td borderBottom="None">
                        <Text fontSize="md" fontWeight="medium">
                          {renderDuration(86400)}
                        </Text>
                      </Td>
                      <Td borderBottom="None">
                        <Text fontSize="md" fontWeight="medium">
                          Test Initiative
                        </Text>
                      </Td>
                    </Tr>
                  );
                })}
            </Tbody>
          </Table>
        )}
      </Box>
    </Stack>
  );
};
