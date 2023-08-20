import { Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
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
  const [isError, setIsError] = useState(false);
  const { publicKey } = useWallet();

  useEffect(() => {
    if (publicKey == null) {
      return;
    }

    let didCancel = false;
    fetch(`/api/memento/${publicKey.toBase58()}`)
      .then((res) => {
        res.json().then((data) => {
          if (!didCancel) {
            setMementos(data.userMementos as IMemento[]);
          }
        });
      })
      .catch(() => {
        if (!didCancel) {
          setIsError(true);
        }
      });
    return () => {
      didCancel = true;
    };
  }, [publicKey]);

  return (
    <Table>
      <Thead>
        <Tr>
          <Th>
            <StarIcon boxSize={4} />
          </Th>
          <Th fontSize="sm" fontFamily="inherit" fontWeight="bold">
            MEMENTO
          </Th>
          <Th fontSize="sm" fontFamily="inherit" fontWeight="bold">
            TOKEN
          </Th>
          <Th fontSize="sm" fontFamily="inherit" fontWeight="bold">
            VALUE
          </Th>
          <Th fontSize="sm" fontFamily="inherit" fontWeight="bold">
            DURATION
          </Th>
          <Th fontSize="sm" fontFamily="inherit" fontWeight="bold">
            INITIATIVE
          </Th>
        </Tr>
      </Thead>
      <Tbody>
        {mementos.map((memento, index) => {
          return (
            <Tr key={memento._id}>
              <Td fontSize="sm" fontWeight="medium">
                <StarIcon boxSize={4} /> {index + 1}
              </Td>
              <Td fontSize="sm" fontWeight="medium">
                {memento.name}
              </Td>
              <Td fontSize="sm" fontWeight="medium">
                {memento.typeOfNft}
              </Td>
              <Td fontSize="sm" fontWeight="medium">
                {memento.quantityLocked}
              </Td>
              <Td fontSize="sm" fontWeight="medium">
                {Duration.fromObject({ seconds: 86400 }).toHuman({
                  unitDisplay: 'short',
                  listStyle: 'narrow',
                })}
              </Td>
              <Td fontSize="sm" fontWeight="medium">
                Test Initiative
              </Td>
            </Tr>
          );
        })}
      </Tbody>
    </Table>
  );
};
