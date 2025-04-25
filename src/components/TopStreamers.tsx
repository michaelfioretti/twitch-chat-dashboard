import { useEffect, useState } from 'react';
import {
  Box,
  Link,
  Text,
  Skeleton,
  Table,
  TableContainer,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Image,
  HStack,
} from '@chakra-ui/react';

interface Streamer {
  name: string;
  totalMsgs: number;
  totalBits: number;
  avgBits: number;
  modPercentage: number;
  subPercentage: number;
  profile: string;
  profileImage: string;
  streamUrl: string;
}

const TopStreamers = () => {
  const [streamers, setStreamers] = useState<Streamer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStreamers = async () => {
      try {
        const response = await fetch('https://twitch-chat-api.onrender.com/api/streamer/top10');
        if (!response.ok) {
          throw new Error('Failed to fetch streamers');
        }
        const data = await response.json();
        setStreamers(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchStreamers();
  }, []);

  if (loading) {
    return (
      <Box>
        <Skeleton height="40px" mb={4} />
        <Skeleton height="40px" mb={4} />
        <Skeleton height="40px" mb={4} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={4} color="red.500">
        <Text>Error: {error}</Text>
      </Box>
    );
  }

  return (
    <Box>
      <Text fontSize="xl" fontWeight="bold" mb={4}>Top Streamers</Text>
      <TableContainer>
        <Table variant="simple" colorScheme="whiteAlpha">
          <Thead>
            <Tr>
              <Th>Streamer</Th>
              <Th isNumeric>Total Messages</Th>
              <Th isNumeric>Total Bits</Th>
              <Th isNumeric>Avg Bits/Message</Th>
              <Th isNumeric>Mod %</Th>
              <Th isNumeric>Sub %</Th>
            </Tr>
          </Thead>
          <Tbody>
            {streamers.map((streamer) => (
              <Tr key={streamer.name}>
                <Td>
                  <HStack>
                    <Image
                      src={streamer.profileImage}
                      alt={streamer.name}
                      boxSize="40px"
                      borderRadius="full"
                    />
                    <Link href={streamer.streamUrl} target="_blank" color="purple.400">
                      {streamer.name}
                    </Link>
                  </HStack>
                </Td>
                <Td isNumeric>{streamer.totalMsgs.toLocaleString()}</Td>
                <Td isNumeric>{streamer.totalBits.toLocaleString()}</Td>
                <Td isNumeric>{streamer.avgBits.toFixed(3)}</Td>
                <Td isNumeric>{streamer.modPercentage.toFixed(1)}%</Td>
                <Td isNumeric>{streamer.subPercentage.toFixed(1)}%</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TopStreamers;
