import {
  Box,
  Input,
  InputGroup,
  InputLeftElement,
  useColorModeValue,
  Icon,
  Text,
  VStack,
  HStack,
  Image,
  Link,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useBreakpointValue,
  Card,
  CardBody,
  Stat,
  StatLabel,
  StatNumber,
  Grid,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { SearchIcon } from '@chakra-ui/icons';
import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { API_ENDPOINTS } from '../constants/api';

const MotionBox = motion(Box);
const MotionTr = motion(Tr);

interface ChatData {
  data: {
    timeframe: number;
    totalMsg: number;
    avgMsg: number;
    channels: string[];
    users: string[];
  }
}

interface StreamerMetadata {
  name: string;
  broadcasterType: string;
  description: string;
  image: string;
}

interface StreamerSearchProps {
  metadata: StreamerMetadata[];
}

const StreamerSearch = ({ metadata }: StreamerSearchProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  const cardBg = useColorModeValue('gray.800', 'gray.700');
  const cardHoverBg = useColorModeValue('gray.700', 'gray.600');
  const borderColor = useColorModeValue('gray.700', 'gray.600');
  const placeholderColor = useColorModeValue('gray.500', 'gray.400');
  const textColor = useColorModeValue('gray.400', 'gray.300');
  const statColor = useColorModeValue('white', 'white');

  const displayMode = useBreakpointValue({ base: 'card', md: 'table' });
  const containerPadding = useBreakpointValue({ base: 4, md: 6, lg: 8 });

  // Debounce the search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Query the API when debounced search term changes
  const { data, isLoading, isError } = useQuery<ChatData>({
    queryKey: ['chat', debouncedSearchTerm],
    queryFn: async () => {
      if (!debouncedSearchTerm) return null;
      const response = await fetch(`${API_ENDPOINTS.CHAT}?channels=${debouncedSearchTerm}`);
      if (!response.ok) {
        throw new Error('Failed to fetch chat data');
      }
      return response.json();
    },
    enabled: !!debouncedSearchTerm,
  });

  const currentStreamer = useMemo(() =>
    metadata.find(m => m.name?.toLowerCase() === debouncedSearchTerm.toLowerCase()),
    [metadata, debouncedSearchTerm]
  );

  const renderStreamerCard = () => {
    if (!currentStreamer) return null;

    const totalMsg = data?.data.totalMsg ?? 0;
    const avgMsg = data?.data.avgMsg ?? 0;

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
                src={currentStreamer.image}
                alt={currentStreamer.name}
                boxSize="48px"
                borderRadius="full"
                border="2px solid"
                borderColor="purple.400"
              />
              <Box>
                <Link
                  href={`https://twitch.tv/${currentStreamer.name}`}
                  target="_blank"
                  color="purple.400"
                  fontSize="lg"
                  fontWeight="medium"
                  _hover={{ color: 'purple.300', textDecoration: 'none' }}
                >
                  {currentStreamer.name}
                </Link>
                {currentStreamer.broadcasterType && (
                  <Text fontSize="sm" color={textColor}>
                    {currentStreamer.broadcasterType.charAt(0).toUpperCase() +
                     currentStreamer.broadcasterType.slice(1)}
                  </Text>
                )}
                {currentStreamer.description && (
                  <Text fontSize="sm" color={textColor} noOfLines={2}>
                    {currentStreamer.description}
                  </Text>
                )}
              </Box>
            </HStack>

            <Grid templateColumns="repeat(2, 1fr)" gap={3}>
              <Stat size="sm">
                <StatLabel color={textColor} fontSize="xs">Total Messages</StatLabel>
                <StatNumber fontSize="md" color={statColor}>
                  {totalMsg.toLocaleString()}
                </StatNumber>
              </Stat>
              <Stat size="sm">
                <StatLabel color={textColor} fontSize="xs">Avg Messages</StatLabel>
                <StatNumber fontSize="md" color={statColor}>
                  {avgMsg.toLocaleString()}
                </StatNumber>
              </Stat>
            </Grid>
          </VStack>
        </CardBody>
      </Card>
    );
  };

  const renderStreamerTable = () => {
    if (!currentStreamer || !data) return null;

    return (
      <Box overflowX="auto">
        <Table variant="simple" colorScheme="whiteAlpha" size="lg">
          <Thead>
            <Tr>
              <Th color={textColor} fontSize="md" py={4} borderBottomColor={borderColor}>
                Streamer
              </Th>
              <Th isNumeric color={textColor} fontSize="md" py={4} borderBottomColor={borderColor}>
                Total Messages
              </Th>
              <Th isNumeric color={textColor} fontSize="md" py={4} borderBottomColor={borderColor}>
                Avg Messages
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            <MotionTr
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ transition: 'all 0.3s' }}
              _hover={{ bg: cardHoverBg }}
            >
              <Td py={4} borderBottomColor={borderColor}>
                <HStack spacing={4}>
                  <Image
                    src={currentStreamer.image}
                    alt={currentStreamer.name}
                    boxSize="48px"
                    borderRadius="full"
                    border="2px solid"
                    borderColor="purple.400"
                  />
                  <Box>
                    <Link
                      href={`https://twitch.tv/${currentStreamer.name}`}
                      target="_blank"
                      color="purple.400"
                      fontSize="lg"
                      fontWeight="medium"
                      _hover={{ color: 'purple.300', textDecoration: 'none' }}
                    >
                      {currentStreamer.name}
                    </Link>
                    {currentStreamer.broadcasterType && (
                      <Text fontSize="sm" color={textColor}>
                        {currentStreamer.broadcasterType.charAt(0).toUpperCase() +
                         currentStreamer.broadcasterType.slice(1)}
                      </Text>
                    )}
                    {currentStreamer.description && (
                      <Text fontSize="sm" color={textColor} noOfLines={1}>
                        {currentStreamer.description}
                      </Text>
                    )}
                  </Box>
                </HStack>
              </Td>
              <Td isNumeric color={statColor} fontSize="lg" py={4} borderBottomColor={borderColor}>
                {data.data.totalMsg.toLocaleString()}
              </Td>
              <Td isNumeric color={statColor} fontSize="lg" py={4} borderBottomColor={borderColor}>
                {data.data.avgMsg.toLocaleString()}
              </Td>
            </MotionTr>
          </Tbody>
        </Table>
      </Box>
    );
  };

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      p={containerPadding}
      bg={cardBg}
      borderRadius="xl"
      boxShadow="xl"
      border="1px solid"
      borderColor={borderColor}
      position="relative"
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
      <Box position="relative" zIndex={1}>
        <VStack spacing={6} align="stretch">
          <InputGroup size="lg">
            <InputLeftElement pointerEvents="none">
              <Icon as={SearchIcon} color={placeholderColor} />
            </InputLeftElement>
            <Input
              placeholder="Search for a streamer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              bg={cardBg}
              borderColor={borderColor}
              color="white"
              _placeholder={{ color: placeholderColor }}
              _hover={{ borderColor: 'purple.400' }}
              _focus={{
                borderColor: 'purple.400',
                boxShadow: '0 0 0 1px rgba(139, 92, 246, 0.3)',
              }}
            />
          </InputGroup>

          {isLoading && debouncedSearchTerm && (
            <Text color={textColor} textAlign="center">
              Loading chat data for {debouncedSearchTerm}...
            </Text>
          )}

          {isError && (
            <Text color="red.400" textAlign="center">
              Error loading chat data
            </Text>
          )}

          {data && (displayMode === 'card' ? renderStreamerCard() : renderStreamerTable())}
        </VStack>
      </Box>
    </MotionBox>
  );
};

export default StreamerSearch;
