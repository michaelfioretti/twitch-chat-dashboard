import { Box, Heading, Stat, StatLabel, StatNumber, StatGroup } from '@chakra-ui/react'
import { useEffect, useState } from 'react'

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
        const response = await fetch('https://twitch-chat-api.onrender.com/api/stats/overview')
        if (!response.ok) {
          throw new Error('Failed to fetch overview stats')
        }
        const data = await response.json()
        setStats(data.data)
      } catch (err) {
        console.error('Error fetching overview stats:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchOverviewStats()
  }, [])

  if (loading) {
    return <Box>Loading overview statistics...</Box>
  }

  if (!stats) {
    return <Box>Failed to load overview statistics</Box>
  }

  return (
    <Box>
      <Heading size="md" mb={4}>Overview</Heading>
      <StatGroup>
        <Stat>
          <StatLabel>Total Messages</StatLabel>
          <StatNumber>{stats.totalMessages.toLocaleString()}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Unique Users</StatLabel>
          <StatNumber>{stats.uniqueUsers.toLocaleString()}</StatNumber>
        </Stat>
      </StatGroup>
    </Box>
  )
}

export default StatsOverview
