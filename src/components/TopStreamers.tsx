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
  VStack,
  Heading,
  Text,
  useColorModeValue,
  Icon,
  Grid,
  useBreakpointValue,
  Card,
  CardBody,
  Stat,
  StatLabel,
  StatNumber,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useState, useMemo } from 'react';
import { ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { API_ENDPOINTS } from '../constants/api';
import { itemVariants } from '../constants/animations';

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

interface StreamerCardProps {
  streamer: Streamer;
}

const StreamerCard = ({ streamer }: StreamerCardProps) => {
  const cardHoverBg = useColorModeValue('gray.700', 'gray.600');
  const textColor = useColorModeValue('gray.400', 'gray.300');
  const statColor = useColorModeValue('white', 'white');
  const borderColor = useColorModeValue('gray.700', 'gray.600');

  return (
    <Card
      bg={cardHoverBg}
      borderRadius="lg"
      overflow="hidden"
      border="1px solid"
      borderColor={borderColor}
      _hover={{ transform: 'translateY(-2px)', transition: 'transform 0.2s' }}
    >
      <CardBody>
        <VStack align="stretch" spacing={4}>
          <HStack spacing={3}>
            <Image
              src={streamer.image}
              alt={streamer.name}
              boxSize="48px"
              borderRadius="full"
              border="2px solid"
              borderColor="purple.400"
            />
            <Box>
              <Link
                href={`https://twitch.tv/${streamer.name}`}
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
            </Box>
          </HStack>

          <Grid templateColumns="repeat(2, 1fr)" gap={3}>
            <Stat size="sm">
              <StatLabel color={textColor} fontSize="xs">Messages</StatLabel>
              <StatNumber fontSize="md" color={statColor}>{streamer.totalMsgs.toLocaleString()}</StatNumber>
            </Stat>
            <Stat size="sm">
              <StatLabel color={textColor} fontSize="xs">Total Bits</StatLabel>
              <StatNumber fontSize="md" color={statColor}>{streamer.totalBits.toLocaleString()}</StatNumber>
            </Stat>
            <Stat size="sm">
              <StatLabel color={textColor} fontSize="xs">Avg Bits</StatLabel>
              <StatNumber fontSize="md" color={statColor}>{streamer.avgBits.toFixed(2)}</StatNumber>
            </Stat>
            <Stat size="sm">
              <StatLabel color={textColor} fontSize="xs">Sub %</StatLabel>
              <StatNumber fontSize="md" color={statColor}>{streamer.subPercentage.toFixed(1)}%</StatNumber>
            </Stat>
          </Grid>
        </VStack>
      </CardBody>
    </Card>
  );
};

const TopStreamers = () => {
  const [sortField, setSortField] = useState<SortField>('totalMsgs');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const cardBg = useColorModeValue('gray.800', 'gray.700');
  const cardHoverBg = useColorModeValue('gray.700', 'gray.600');
  const textColor = useColorModeValue('gray.400', 'gray.300');
  const borderColor = useColorModeValue('gray.700', 'gray.600');

  const { data: topStreamersData, isLoading: isLoadingStreamers, error: streamersError } = useQuery<{ data: Streamer[] }>({
    queryKey: ['topStreamers'],
    queryFn: async () => {
      const response = await fetch(API_ENDPOINTS.TOP_STREAMERS);
      if (!response.ok) {
        throw new Error('Failed to fetch top streamers');
      }
      return response.json();
    },
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { data: metadataData, isLoading: isLoadingMetadata, error: metadataError } = useQuery<StreamerMetadata[]>({
    queryKey: ['streamerMetadata'],
    queryFn: async () => {
      const response = await fetch(API_ENDPOINTS.STREAMER_METADATA);
      if (!response.ok) {
        throw new Error('Failed to fetch streamer metadata');
      }
      return response.json();
    },
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const isLoading = isLoadingStreamers || isLoadingMetadata;
  const error = streamersError || metadataError;

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
    if (field !== sortField) return undefined;
    return sortDirection === 'asc' ? ChevronUpIcon : ChevronDownIcon;
  };

  const displayMode = useBreakpointValue({ base: 'cards', md: 'table' });
  const containerPadding = useBreakpointValue({ base: 4, md: 6, lg: 8 });
  const headingSize = useBreakpointValue({ base: 'md', md: 'lg' });
  const gridColumns = useBreakpointValue({ base: 1, sm: 2, lg: 3 });
  const tableFontSize = useBreakpointValue({ base: 'sm', md: 'md' });
  const tablePadding = useBreakpointValue({ base: 2, md: 4 });

  if (isLoading) {
    return (
      <Box p={containerPadding} bg={cardBg} borderRadius="xl" boxShadow="xl" width="100%" maxWidth="100%">
        <Skeleton height="40px" mb={4} />
        {displayMode === 'cards' ? (
          <Grid templateColumns={`repeat(${gridColumns}, 1fr)`} gap={4} width="100%">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} height="200px" borderRadius="lg" />
            ))}
          </Grid>
        ) : (
          <Skeleton height="400px" />
        )}
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={containerPadding} bg="red.900" color="white" borderRadius="lg" width="100%" maxWidth="100%">
        Failed to load streamer data
      </Box>
    );
  }

  return (
    <Box
      as={MotionBox}
      variants={itemVariants}
      p={containerPadding}
      bg={cardBg}
      borderRadius="xl"
      boxShadow="xl"
      border="1px solid"
      borderColor={borderColor}
      position="relative"
      width="100%"
      maxWidth="100%"
      mx="auto"
      overflow="hidden"
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
      <Box position="relative" zIndex={1} width="100%" maxWidth="100%">
        <Heading size={headingSize} mb={6} color="purple.400" letterSpacing="tight">
          Top 10 Streamers by Chat
        </Heading>

        {displayMode === 'cards' ? (
          <Grid templateColumns={`repeat(${gridColumns}, 1fr)`} gap={4} width="100%">
            {streamers.map((streamer) => (
              <StreamerCard key={streamer.name} streamer={streamer} />
            ))}
          </Grid>
        ) : (
          <Box overflowX="auto">
            <Table variant="simple" colorScheme="whiteAlpha" size={tableFontSize}>
              <Thead>
                <Tr>
                  <Th py={tablePadding} borderBottomColor={borderColor}>Streamer</Th>
                  <Th py={tablePadding} borderBottomColor={borderColor} isNumeric>
                    <HStack spacing={1} justify="flex-end" cursor="pointer" onClick={() => handleSort('totalMsgs')}>
                      <Text>Messages</Text>
                      {getSortIcon('totalMsgs') && <Icon as={getSortIcon('totalMsgs')} />}
                    </HStack>
                  </Th>
                  <Th py={tablePadding} borderBottomColor={borderColor} isNumeric>
                    <HStack spacing={1} justify="flex-end" cursor="pointer" onClick={() => handleSort('totalBits')}>
                      <Text>Total Bits</Text>
                      {getSortIcon('totalBits') && <Icon as={getSortIcon('totalBits')} />}
                    </HStack>
                  </Th>
                  <Th py={tablePadding} borderBottomColor={borderColor} isNumeric>
                    <HStack spacing={1} justify="flex-end" cursor="pointer" onClick={() => handleSort('avgBits')}>
                      <Text>Avg Bits</Text>
                      {getSortIcon('avgBits') && <Icon as={getSortIcon('avgBits')} />}
                    </HStack>
                  </Th>
                  <Th py={tablePadding} borderBottomColor={borderColor} isNumeric>
                    <HStack spacing={1} justify="flex-end" cursor="pointer" onClick={() => handleSort('subPercentage')}>
                      <Text>Sub %</Text>
                      {getSortIcon('subPercentage') && <Icon as={getSortIcon('subPercentage')} />}
                    </HStack>
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {streamers.map((streamer) => (
                  <MotionTr
                    key={streamer.name}
                    variants={itemVariants}
                    style={{ transition: 'all 0.3s' }}
                    _hover={{ bg: cardHoverBg }}
                  >
                    <Td py={tablePadding} borderBottomColor={borderColor}>
                      <HStack spacing={4}>
                        <Image
                          src={streamer.image}
                          alt={streamer.name}
                          boxSize="48px"
                          borderRadius="full"
                          border="2px solid"
                          borderColor="purple.400"
                        />
                        <Box>
                          <Link
                            href={`https://twitch.tv/${streamer.name}`}
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
                        </Box>
                      </HStack>
                    </Td>
                    <Td isNumeric py={tablePadding} borderBottomColor={borderColor}>{streamer.totalMsgs.toLocaleString()}</Td>
                    <Td isNumeric py={tablePadding} borderBottomColor={borderColor}>{streamer.totalBits.toLocaleString()}</Td>
                    <Td isNumeric py={tablePadding} borderBottomColor={borderColor}>{streamer.avgBits.toFixed(2)}</Td>
                    <Td isNumeric py={tablePadding} borderBottomColor={borderColor}>{streamer.subPercentage.toFixed(1)}%</Td>
                  </MotionTr>
                ))}
              </Tbody>
            </Table>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default TopStreamers;
