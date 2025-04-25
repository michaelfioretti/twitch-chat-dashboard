import { useEffect, useState } from 'react';
import {
  Box,
  Link,
  Skeleton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Image,
  HStack,
  Heading,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { API_ENDPOINTS } from '../constants/api';

const MotionBox = motion(Box);
const MotionTr = motion(Tr);

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

  useEffect(() => {
    const fetchStreamers = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.TOP_STREAMERS);
        if (!response.ok) {
          throw new Error('Failed to fetch streamers');
        }
        const data = await response.json();
        setStreamers(data.data);
      } catch (err) {
        console.error('Error fetching streamers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStreamers();
  }, []);

  if (loading) {
    return (
      <Box p={8} bg="gray.800" borderRadius="xl" boxShadow="xl">
        <Skeleton height="40px" mb={6} />
        <Skeleton height="400px" />
      </Box>
    );
  }

  return (
    <Box
      as={MotionBox}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ transition: 'all 0.5s' }}
      p={8}
      bg="gray.800"
      borderRadius="xl"
      boxShadow="xl"
      border="1px solid"
      borderColor="gray.700"
      overflowX="auto"
    >
      <Heading size="lg" mb={8} color="purple.400" letterSpacing="tight">Top Streamers</Heading>
      <Table variant="simple" colorScheme="whiteAlpha" size="lg">
        <Thead>
          <Tr>
            <Th
              color="gray.400"
              fontSize="md"
              py={4}
              borderBottomColor="gray.600"
            >
              Streamer
            </Th>
            <Th
              isNumeric
              color="gray.400"
              fontSize="md"
              py={4}
              borderBottomColor="gray.600"
            >
              Total Messages
            </Th>
            <Th
              isNumeric
              color="gray.400"
              fontSize="md"
              py={4}
              borderBottomColor="gray.600"
            >
              Total Bits
            </Th>
            <Th
              isNumeric
              color="gray.400"
              fontSize="md"
              py={4}
              borderBottomColor="gray.600"
            >
              Avg Bits/Message
            </Th>
            <Th
              isNumeric
              color="gray.400"
              fontSize="md"
              py={4}
              borderBottomColor="gray.600"
            >
              Mod %
            </Th>
            <Th
              isNumeric
              color="gray.400"
              fontSize="md"
              py={4}
              borderBottomColor="gray.600"
            >
              Sub %
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {streamers.map((streamer, index) => (
            <MotionTr
              key={streamer.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ transition: `all 0.3s ${index * 0.1}s` }}
              _hover={{ bg: 'gray.700' }}
            >
              <Td py={4} borderBottomColor="gray.700">
                <HStack spacing={4}>
                  <Box
                    as={motion.div}
                    whileHover={{ scale: 1.1 }}
                    style={{ transition: 'transform 0.2s' }}
                  >
                    <Image
                      src={streamer.profileImage}
                      alt={streamer.name}
                      boxSize="48px"
                      borderRadius="full"
                      border="2px solid"
                      borderColor="purple.400"
                    />
                  </Box>
                  <Link
                    href={streamer.streamUrl}
                    target="_blank"
                    color="purple.400"
                    fontSize="lg"
                    fontWeight="medium"
                    _hover={{ color: 'purple.300', textDecoration: 'none' }}
                  >
                    {streamer.name}
                  </Link>
                </HStack>
              </Td>
              <Td isNumeric color="white" fontSize="lg" py={4} borderBottomColor="gray.700">
                {streamer.totalMsgs.toLocaleString()}
              </Td>
              <Td isNumeric color="white" fontSize="lg" py={4} borderBottomColor="gray.700">
                {streamer.totalBits.toLocaleString()}
              </Td>
              <Td isNumeric color="white" fontSize="lg" py={4} borderBottomColor="gray.700">
                {streamer.avgBits.toFixed(3)}
              </Td>
              <Td isNumeric color="white" fontSize="lg" py={4} borderBottomColor="gray.700">
                {streamer.modPercentage.toFixed(1)}%
              </Td>
              <Td isNumeric color="white" fontSize="lg" py={4} borderBottomColor="gray.700">
                {streamer.subPercentage.toFixed(1)}%
              </Td>
            </MotionTr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default TopStreamers;
