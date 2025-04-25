import { Box, Heading, Stat, StatLabel, StatNumber, StatGroup } from '@chakra-ui/react'
import { useEffect, useState } from 'react'

interface BitsStats {
  averageBitsPerMessage: number
  totalBits: number
  highestBitsMessage: number
}

const BitsStats = () => {
  const [stats, setStats] = useState<BitsStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBitsStats = async () => {
      try {
        const response = await fetch('https://twitch-chat-api.onrender.com/api/bits')
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
    return <Box>Loading bits statistics...</Box>
  }

  if (!stats) {
    return <Box>Failed to load bits statistics</Box>
  }

  return (
    <Box>
      <Heading size="md" mb={4}>Bits Statistics</Heading>
      <StatGroup>
        <Stat>
          <StatLabel>Average Bits per Message</StatLabel>
          <StatNumber>{stats.averageBitsPerMessage.toFixed(2)}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Total Bits</StatLabel>
          <StatNumber>{stats.totalBits.toLocaleString()}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Highest Bits in a Message</StatLabel>
          <StatNumber>{stats.highestBitsMessage.toLocaleString()}</StatNumber>
        </Stat>
      </StatGroup>
    </Box>
  )
}

export default BitsStats
