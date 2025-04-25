import { Box, Heading, Stat, StatLabel, StatNumber, Grid, Skeleton, useColorModeValue } from '@chakra-ui/react'
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
      <Box p={8} bg={cardBg} borderRadius="xl" boxShadow="xl">
        <Skeleton height="40px" mb={6} />
        <Grid templateColumns="1fr" gap={6}>
          <Skeleton height="120px" />
          <Skeleton height="120px" />
        </Grid>
      </Box>
    )
  }

  if (isError || !stats) {
    return (
      <Box p={8} bg="red.900" color="white" borderRadius="xl">
        Failed to load bits statistics
      </Box>
    )
  }

  return (
    <Box
      as={MotionBox}
      whileHover={{ scale: 1.02 }}
      p={8}
      bg={cardBg}
      borderRadius="xl"
      boxShadow="xl"
      border="1px solid"
      borderColor="gray.700"
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
        <Heading size="lg" mb={8} color="purple.400" letterSpacing="tight">Bits Statistics</Heading>
        <Grid templateColumns="1fr" gap={6}>
          <MotionStat
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            p={6}
            bg={cardHoverBg}
            borderRadius="lg"
            textAlign="center"
            style={{ transition: 'background 0.2s' }}
            _hover={{ bg: cardHoverBg }}
            position="relative"
            overflow="hidden"
          >
            <StatLabel fontSize="xl" color={textColor} mb={3}>Average Bits per Message</StatLabel>
            <StatNumber
              fontSize="5xl"
              color={statColor}
              fontWeight="bold"
              textShadow="0 0 10px rgba(139, 92, 246, 0.3)"
            >
              {stats.data.avgBits.toFixed(2)}
            </StatNumber>
          </MotionStat>
          <MotionStat
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            p={6}
            bg={cardHoverBg}
            borderRadius="lg"
            textAlign="center"
            style={{ transition: 'background 0.2s' }}
            _hover={{ bg: cardHoverBg }}
            position="relative"
            overflow="hidden"
          >
            <StatLabel fontSize="xl" color={textColor} mb={3}>Total Bits</StatLabel>
            <StatNumber
              fontSize="5xl"
              color={statColor}
              fontWeight="bold"
              textShadow="0 0 10px rgba(139, 92, 246, 0.3)"
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
