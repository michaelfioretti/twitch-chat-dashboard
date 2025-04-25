import { Box, Heading, Stat, StatLabel, StatNumber, Grid, Skeleton } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { API_ENDPOINTS } from '../constants/api'

const MotionBox = motion(Box)
const MotionStat = motion(Stat)

interface BitsStats {
  avgBits: number
  totalBits: number
}

const BitsStats = () => {
  const [stats, setStats] = useState<BitsStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBitsStats = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.BITS)
        if (!response.ok) {
          throw new Error('Failed to fetch bits stats')
        }
        const data = await response.json()
        setStats(data.data)
      } catch (err) {
        console.error('Error fetching bits stats:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchBitsStats()
  }, [])

  if (loading) {
    return (
      <Box p={8} bg="gray.800" borderRadius="xl" boxShadow="xl">
        <Skeleton height="40px" mb={6} />
        <Grid templateColumns="1fr" gap={6}>
          <Skeleton height="120px" />
          <Skeleton height="120px" />
        </Grid>
      </Box>
    )
  }

  if (!stats) {
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
      bg="gray.800"
      borderRadius="xl"
      boxShadow="xl"
      border="1px solid"
      borderColor="gray.700"
    >
      <Heading size="lg" mb={8} color="purple.400" letterSpacing="tight">Bits Statistics</Heading>
      <Grid templateColumns="1fr" gap={6}>
        <MotionStat
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          p={6}
          bg="gray.700"
          borderRadius="lg"
          textAlign="center"
          style={{ transition: 'background 0.2s' }}
          _hover={{ bg: 'gray.600' }}
        >
          <StatLabel fontSize="xl" color="gray.400" mb={3}>Average Bits per Message</StatLabel>
          <StatNumber
            fontSize="5xl"
            color="white"
            fontWeight="bold"
            textShadow="0 0 10px rgba(168, 85, 247, 0.3)"
          >
            {stats.avgBits.toFixed(2)}
          </StatNumber>
        </MotionStat>
        <MotionStat
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          p={6}
          bg="gray.700"
          borderRadius="lg"
          textAlign="center"
          style={{ transition: 'background 0.2s' }}
          _hover={{ bg: 'gray.600' }}
        >
          <StatLabel fontSize="xl" color="gray.400" mb={3}>Total Bits</StatLabel>
          <StatNumber
            fontSize="5xl"
            color="white"
            fontWeight="bold"
            textShadow="0 0 10px rgba(168, 85, 247, 0.3)"
          >
            {stats.totalBits.toLocaleString()}
          </StatNumber>
        </MotionStat>
      </Grid>
    </Box>
  )
}

export default BitsStats
