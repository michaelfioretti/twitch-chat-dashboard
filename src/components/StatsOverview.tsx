import { Box, Heading, Stat, StatLabel, StatNumber, Grid, Skeleton } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { API_ENDPOINTS } from '../constants/api'

const MotionBox = motion(Box)
const MotionStat = motion(Stat)

interface OverviewStats {
  totalMessages: number
  uniqueUsers: number
}

const StatsOverview = () => {
  const [stats, setStats] = useState<OverviewStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOverviewStats = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.OVERVIEW)
        if (!response.ok) {
          throw new Error('Failed to fetch overview stats')
        }
        const data = await response.json()
        setStats(data)
      } catch (err) {
        console.error('Error fetching overview stats:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchOverviewStats()
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
        Failed to load overview statistics
      </Box>
    )
  }

  return (
    <Box
      as={MotionBox}
      whileHover={{ scale: 1.02 }}
      style={{ transition: 'transform 0.2s' }}
      p={8}
      bg="gray.800"
      borderRadius="xl"
      boxShadow="xl"
      border="1px solid"
      borderColor="gray.700"
    >
      <Heading size="lg" mb={8} color="purple.400" letterSpacing="tight">Overview</Heading>
      <Grid templateColumns="1fr" gap={6}>
        <MotionStat
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ transition: 'all 0.5s' }}
          p={6}
          bg="gray.700"
          borderRadius="lg"
          textAlign="center"
          _hover={{ bg: 'gray.600' }}
        >
          <StatLabel fontSize="xl" color="gray.400" mb={3}>Total Messages</StatLabel>
          <StatNumber
            fontSize="5xl"
            color="white"
            fontWeight="bold"
            textShadow="0 0 10px rgba(168, 85, 247, 0.3)"
          >
            {stats.totalMessages.toLocaleString()}
          </StatNumber>
        </MotionStat>
        <MotionStat
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ transition: 'all 0.5s' }}
          p={6}
          bg="gray.700"
          borderRadius="lg"
          textAlign="center"
          _hover={{ bg: 'gray.600' }}
        >
          <StatLabel fontSize="xl" color="gray.400" mb={3}>Unique Users</StatLabel>
          <StatNumber
            fontSize="5xl"
            color="white"
            fontWeight="bold"
            textShadow="0 0 10px rgba(168, 85, 247, 0.3)"
          >
            {stats.uniqueUsers.toLocaleString()}
          </StatNumber>
        </MotionStat>
      </Grid>
    </Box>
  )
}

export default StatsOverview
