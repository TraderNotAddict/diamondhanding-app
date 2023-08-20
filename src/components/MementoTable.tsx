import {
  Box,
  HStack,
  Image,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';
import { IMemento } from '@/models/memento';
import { NftTypes } from '@/models/enums/NftTypes';
import { NftCollection } from '@/models/enums/NftCollection';
import { Duration } from 'luxon';
import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';

// Stateful component
export const MementoTable = () => {
  const [mementos, setMementos] = useState<IMemento[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const { publicKey, connecting } = useWallet();
  const [hasStartedConnecting, setHasStartedConnecting] = useState(false);
  const [favourites, setFavourites] = useState(new Set<string>()); // Temp implementation
  const [filterFavourites, setFilterFavourites] = useState(false);

  useEffect(() => {
    if (!connecting && !hasStartedConnecting) {
      return;
    }
    if (connecting) {
      setHasStartedConnecting(true);
      return;
    }
    if (publicKey == null) {
      setIsLoading(false);
      return;
    }

    let didCancel = false;
    fetch(`/api/memento/${publicKey.toBase58()}`)
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
  }, [publicKey, connecting, hasStartedConnecting]);

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

  // User is not logged in
  if (publicKey == null && !connecting && hasStartedConnecting) {
    // TODO: Return a tutorial state here
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
    <Box overflowX="auto" mx={2} my={6}>
      <Table>
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
        <Tbody>
          {mementos
            .filter(
              (memento) => !filterFavourites || favourites.has(memento._id)
            )
            .map((memento, index) => {
              return (
                <Tr key={memento._id}>
                  <Td>
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
                  <Td py={1}>
                    <HStack spacing={3}>
                      <Image
                        src={memento.image}
                        alt={memento.name}
                        boxSize={14}
                        maxW={undefined}
                      />
                      <Text fontSize="md" fontWeight="medium">
                        {memento.name}
                      </Text>
                    </HStack>
                  </Td>
                  <Td>
                    <Text fontSize="md" fontWeight="medium">
                      {memento.typeOfNft}
                    </Text>
                  </Td>
                  <Td>
                    <Text fontSize="md" fontWeight="medium">
                      {memento.quantityLocked}
                    </Text>
                  </Td>
                  <Td>
                    <Text fontSize="md" fontWeight="medium">
                      {Duration.fromObject({ seconds: 86400 }).toHuman({
                        unitDisplay: 'short',
                        listStyle: 'narrow',
                      })}
                    </Text>
                  </Td>
                  <Td>
                    <Text fontSize="md" fontWeight="medium">
                      Test Initiative
                    </Text>
                  </Td>
                </Tr>
              );
            })}
        </Tbody>
      </Table>
    </Box>
  );
};
