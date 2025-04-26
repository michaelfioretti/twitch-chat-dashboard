import { Box, Heading, Stat, StatLabel, StatNumber, Grid, Skeleton, useColorModeValue, useBreakpointValue } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { API_ENDPOINTS } from '../constants/api'

const MotionBox = motion(Box)
const MotionStat = motion(Stat)

interface BitsStats {
  avgBits: number
  totalBits: number
}

const BitsStats = () => {
  const cardBg = useColorModeValue('gray.800', 'gray.700')
  const cardHoverBg = useColorModeValue('gray.700', 'gray.600')
  const textColor = useColorModeValue('gray.400', 'gray.300')
  const statColor = useColorModeValue('white', 'white')

  // Responsive values
  const headingSize = useBreakpointValue({ base: 'sm', md: 'lg' })
  const statLabelSize = useBreakpointValue({ base: 'sm', md: 'xl' })
  const statNumberSize = useBreakpointValue({ base: 'xl', md: '5xl' })
  const containerPadding = useBreakpointValue({ base: 2, md: 8 })
  const statPadding = useBreakpointValue({ base: 2, md: 4 })
  const gridGap = useBreakpointValue({ base: 2, md: 6 })
  const marginBottom = useBreakpointValue({ base: 2, md: 6 })

  const { data: stats, isLoading, isError } = useQuery<{ data: BitsStats }>({
    queryKey: ['bits'],
    queryFn: async () => {
      const response = await fetch(API_ENDPOINTS.BITS)
      if (!response.ok) {
        throw new Error('Failed to fetch bits stats')
      }
      return response.json()
    }
  })

  if (isLoading) {
    return (
      <Box p={containerPadding} bg={cardBg} borderRadius="lg" boxShadow="xl" width="100%" maxWidth="100%">
        <Skeleton height="20px" mb={2} />
        <Grid templateColumns="1fr" gap={gridGap} width="100%">
          <Skeleton height="60px" />
          <Skeleton height="60px" />
        </Grid>
      </Box>
    )
  }

  if (isError || !stats) {
    return (
      <Box p={containerPadding} bg="red.900" color="white" borderRadius="lg" width="100%" maxWidth="100%">
        Failed to load bits statistics
      </Box>
    )
  }

  return (
    <Box
      as={MotionBox}
      whileHover={{ scale: 1.02 }}
      p={containerPadding}
      bg={cardBg}
      borderRadius="lg"
      boxShadow="xl"
      border="1px solid"
      borderColor="gray.700"
      position="relative"
      overflow="hidden"
      width="100%"
      maxWidth="100%"
      mx="auto"
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
        <Heading size={headingSize} mb={marginBottom} color="purple.400" letterSpacing="tight">Bits Statistics</Heading>
        <Grid templateColumns="1fr" gap={gridGap} width="100%">
          <MotionStat
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            p={statPadding}
            bg={cardHoverBg}
            borderRadius="md"
            textAlign="center"
            style={{ transition: 'background 0.2s' }}
            _hover={{ bg: cardHoverBg }}
            position="relative"
            overflow="hidden"
            width="100%"
            maxWidth="100%"
          >
            <StatLabel fontSize={statLabelSize} color={textColor} mb={1}>Average Bits per Message</StatLabel>
            <StatNumber
              fontSize={statNumberSize}
              color={statColor}
              fontWeight="bold"
              textShadow="0 0 10px rgba(139, 92, 246, 0.3)"
              lineHeight="1"
            >
              {stats.data.avgBits.toFixed(2)}
            </StatNumber>
          </MotionStat>
          <MotionStat
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            p={statPadding}
            bg={cardHoverBg}
            borderRadius="md"
            textAlign="center"
            style={{ transition: 'background 0.2s' }}
            _hover={{ bg: cardHoverBg }}
            position="relative"
            overflow="hidden"
            width="100%"
            maxWidth="100%"
          >
            <StatLabel fontSize={statLabelSize} color={textColor} mb={1}>Total Bits</StatLabel>
            <StatNumber
              fontSize={statNumberSize}
              color={statColor}
              fontWeight="bold"
              textShadow="0 0 10px rgba(139, 92, 246, 0.3)"
              lineHeight="1"
            >
              {stats.data.totalBits.toLocaleString()}
            </StatNumber>
          </MotionStat>
        </Grid>
      </Box>
    </Box>
  )
}

export default BitsStats
