import { Box, Text, Skeleton, useColorModeValue } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { API_ENDPOINTS } from '../constants/api'

const MotionBox = motion(Box)

interface OverviewStats {
  totalMessages: number
  uniqueUsers: number
}

const IntroSection = () => {
  const cardBg = useColorModeValue('gray.800', 'gray.700')
  const textColor = useColorModeValue('gray.400', 'gray.300')
  const highlightColor = useColorModeValue('purple.400', 'purple.300')

  const { data: stats, isLoading, isError } = useQuery<OverviewStats>({
    queryKey: ['overview'],
    queryFn: async () => {
      const response = await fetch(API_ENDPOINTS.OVERVIEW)
      if (!response.ok) {
        throw new Error('Failed to fetch overview stats')
      }
      return response.json()
    }
  })

  if (isLoading) {
    return (
      <Box p={8} bg={cardBg} borderRadius="xl" boxShadow="xl">
        <Skeleton height="100px" />
      </Box>
    )
  }

  if (isError || !stats) {
    return (
      <Box p={8} bg="red.900" color="white" borderRadius="xl">
        Failed to load statistics
      </Box>
    )
  }

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
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
        <Text
          fontSize={{ base: "lg", md: "xl", lg: "2xl" }}
          color={textColor}
          lineHeight="tall"
          textAlign="center"
        >
          This website keeps track of some of the top Twitch streams of the past 24 hours. Over the last 24 hours, we've seen an impressive{' '}
          <Text as="span" color={highlightColor} fontWeight="bold">
            {stats.totalMessages.toLocaleString()}
          </Text>{' '}
          messages from{' '}
          <Text as="span" color={highlightColor} fontWeight="bold">
            {stats.uniqueUsers.toLocaleString()}
          </Text>{' '}
          unique users. Scroll down to see the top streamers of the past 24 hours, or search for your favorite streamer below.
        </Text>
      </Box>
    </MotionBox>
  )
}

export default IntroSection
