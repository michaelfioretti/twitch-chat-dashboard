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
  Text,
  Tooltip,
  useColorModeValue,
  Icon,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useState, useMemo } from 'react';
import { ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons';
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
  image: string;
  broadcasterType?: string;
  description?: string;
}

interface StreamerMetadata {
  name: string;
  broadcasterType: string;
  description: string;
  image: string;
}

type SortField = 'totalMsgs' | 'totalBits' | 'avgBits' | 'modPercentage' | 'subPercentage';
type SortDirection = 'asc' | 'desc';

const TopStreamers = () => {
  const [sortField, setSortField] = useState<SortField>('totalMsgs');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const cardBg = useColorModeValue('gray.800', 'gray.700');
  const cardHoverBg = useColorModeValue('gray.700', 'gray.600');
  const textColor = useColorModeValue('gray.400', 'gray.300');
  const statColor = useColorModeValue('white', 'white');
  const borderColor = useColorModeValue('gray.700', 'gray.600');

  const { data: topStreamersData, isLoading: isLoadingStreamers } = useQuery<{ data: Streamer[] }>({
    queryKey: ['topStreamers'],
    queryFn: async () => {
      const response = await fetch(API_ENDPOINTS.TOP_STREAMERS);
      if (!response.ok) {
        throw new Error('Failed to fetch top streamers');
      }
      return response.json();
    }
  });

  const { data: metadataData, isLoading: isLoadingMetadata } = useQuery<StreamerMetadata[]>({
    queryKey: ['streamerMetadata'],
    queryFn: async () => {
      const response = await fetch(API_ENDPOINTS.STREAMER_METADATA);
      if (!response.ok) {
        throw new Error('Failed to fetch streamer metadata');
      }
      return response.json();
    }
  });

  const isLoading = isLoadingStreamers || isLoadingMetadata;

  const streamers = useMemo(() => {
    if (!topStreamersData?.data || !metadataData) return [];

    const mergedStreamers = topStreamersData.data.map((streamer) => {
      const metadata = metadataData.find((m) => m.name === streamer.name);
      return {
        ...streamer,
        broadcasterType: metadata?.broadcasterType ?
          metadata.broadcasterType.charAt(0).toUpperCase() + metadata.broadcasterType.slice(1) :
          undefined,
        description: metadata?.description,
        image: metadata?.image || streamer.image
      };
    });

    return [...mergedStreamers].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    });
  }, [topStreamersData, metadataData, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (field !== sortField) return null;
    return sortDirection === 'asc' ? ChevronUpIcon : ChevronDownIcon;
  };

  if (isLoading) {
    return (
      <Box p={8} bg={cardBg} borderRadius="xl" boxShadow="xl">
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
      bg={cardBg}
      borderRadius="xl"
      boxShadow="xl"
      border="1px solid"
      borderColor={borderColor}
      overflowX="auto"
      position="relative"
      _before={{
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "100%",
        background: "radial-gradient(circle at top right, rgba(139, 92, 246, 0.1) 0%, transparent 70%)",
        zIndex: 0
      }}
    >
      <Box position="relative" zIndex={1}>
        <Heading size="lg" mb={8} color="purple.400" letterSpacing="tight">Top Streamers</Heading>
        <Table variant="simple" colorScheme="whiteAlpha" size="lg">
          <Thead>
            <Tr>
              <Th
                color={textColor}
                fontSize="md"
                py={4}
                borderBottomColor={borderColor}
              >
                Streamer
              </Th>
              <Th
                isNumeric
                color={textColor}
                fontSize="md"
                py={4}
                borderBottomColor={borderColor}
                cursor="pointer"
                onClick={() => handleSort('totalMsgs')}
                _hover={{ color: 'purple.400' }}
              >
                <HStack justify="flex-end" spacing={1}>
                  <Text>Total Messages</Text>
                  {getSortIcon('totalMsgs') && (
                    <Icon as={getSortIcon('totalMsgs')} boxSize={4} />
                  )}
                </HStack>
              </Th>
              <Th
                isNumeric
                color={textColor}
                fontSize="md"
                py={4}
                borderBottomColor={borderColor}
                cursor="pointer"
                onClick={() => handleSort('totalBits')}
                _hover={{ color: 'purple.400' }}
              >
                <HStack justify="flex-end" spacing={1}>
                  <Text>Total Bits</Text>
                  {getSortIcon('totalBits') && (
                    <Icon as={getSortIcon('totalBits')} boxSize={4} />
                  )}
                </HStack>
              </Th>
              <Th
                isNumeric
                color={textColor}
                fontSize="md"
                py={4}
                borderBottomColor={borderColor}
                cursor="pointer"
                onClick={() => handleSort('avgBits')}
                _hover={{ color: 'purple.400' }}
              >
                <HStack justify="flex-end" spacing={1}>
                  <Text>Avg Bits/Message</Text>
                  {getSortIcon('avgBits') && (
                    <Icon as={getSortIcon('avgBits')} boxSize={4} />
                  )}
                </HStack>
              </Th>
              <Th
                isNumeric
                color={textColor}
                fontSize="md"
                py={4}
                borderBottomColor={borderColor}
                cursor="pointer"
                onClick={() => handleSort('modPercentage')}
                _hover={{ color: 'purple.400' }}
              >
                <HStack justify="flex-end" spacing={1}>
                  <Text>Mod %</Text>
                  {getSortIcon('modPercentage') && (
                    <Icon as={getSortIcon('modPercentage')} boxSize={4} />
                  )}
                </HStack>
              </Th>
              <Th
                isNumeric
                color={textColor}
                fontSize="md"
                py={4}
                borderBottomColor={borderColor}
                cursor="pointer"
                onClick={() => handleSort('subPercentage')}
                _hover={{ color: 'purple.400' }}
              >
                <HStack justify="flex-end" spacing={1}>
                  <Text>Sub %</Text>
                  {getSortIcon('subPercentage') && (
                    <Icon as={getSortIcon('subPercentage')} boxSize={4} />
                  )}
                </HStack>
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
                _hover={{ bg: cardHoverBg }}
              >
                <Td py={4} borderBottomColor={borderColor}>
                  <HStack spacing={4}>
                    <Box
                      as={motion.div}
                      whileHover={{ scale: 1.1 }}
                      style={{ transition: 'transform 0.2s' }}
                    >
                      <Image
                        src={streamer.image}
                        alt={streamer.name}
                        boxSize="48px"
                        borderRadius="full"
                        border="2px solid"
                        borderColor="purple.400"
                      />
                    </Box>
                    <Box>
                      <Link
                        href={streamer.profile}
                        target="_blank"
                        color="purple.400"
                        fontSize="lg"
                        fontWeight="medium"
                        _hover={{ color: 'purple.300', textDecoration: 'none' }}
                      >
                        {streamer.name}
                      </Link>
                      {streamer.broadcasterType && (
                        <Text fontSize="sm" color={textColor}>
                          {streamer.broadcasterType}
                        </Text>
                      )}
                      {streamer.description && (
                        <Tooltip label={streamer.description} placement="right">
                          <Text fontSize="sm" color={textColor} noOfLines={1}>
                            {streamer.description}
                          </Text>
                        </Tooltip>
                      )}
                    </Box>
                  </HStack>
                </Td>
                <Td isNumeric color={statColor} fontSize="lg" py={4} borderBottomColor={borderColor}>
                  {streamer.totalMsgs.toLocaleString()}
                </Td>
                <Td isNumeric color={statColor} fontSize="lg" py={4} borderBottomColor={borderColor}>
                  {streamer.totalBits.toLocaleString()}
                </Td>
                <Td isNumeric color={statColor} fontSize="lg" py={4} borderBottomColor={borderColor}>
                  {streamer.avgBits.toFixed(3)}
                </Td>
                <Td isNumeric color={statColor} fontSize="lg" py={4} borderBottomColor={borderColor}>
                  {streamer.modPercentage.toFixed(1)}%
                </Td>
                <Td isNumeric color={statColor} fontSize="lg" py={4} borderBottomColor={borderColor}>
                  {streamer.subPercentage.toFixed(1)}%
                </Td>
              </MotionTr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};

export default TopStreamers;
