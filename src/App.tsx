import { Box, Heading, Grid, Container, useColorModeValue } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import TopStreamers from './components/TopStreamers'
import BitsStats from './components/BitsStats'
import IntroSection from './components/IntroSection'
import StreamerSearch from './components/StreamerSearch'
import { useQuery } from '@tanstack/react-query'
import { API_ENDPOINTS } from './constants/api'
import { containerVariants, itemVariants } from './constants/animations'

const MotionBox = motion(Box)
const MotionHeading = motion(Heading)

interface StreamerMetadata {
  name: string;
  broadcasterType: string;
  description: string;
  image: string;
}

function App() {
  const bgGradient = useColorModeValue(
    'radial-gradient(circle at center, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
    'radial-gradient(circle at center, rgba(139, 92, 246, 0.2) 0%, transparent 70%)'
  )

  const { data: metadataData, error: metadataError } = useQuery<StreamerMetadata[]>({
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

  const renderContent = () => (
    <MotionBox
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <MotionHeading
        variants={itemVariants}
        mb={{ base: 6, md: 8, lg: 12 }}
        textAlign="center"
        size={{ base: "2xl", md: "3xl", lg: "4xl" }}
        color="white"
        letterSpacing="tight"
        fontWeight="bold"
        textShadow="0 0 20px rgba(139, 92, 246, 0.3)"
      >
        Top Twitch Streams by Chat
      </MotionHeading>

      <MotionBox variants={itemVariants} mb={{ base: 6, md: 8, lg: 12 }}>
        <IntroSection />
      </MotionBox>

      <MotionBox variants={itemVariants} mb={{ base: 6, md: 8, lg: 12 }}>
        <StreamerSearch metadata={metadataData || []} />
      </MotionBox>

      <Grid
        templateAreas={{
          base: `"bits" "streamers"`,
          md: `"bits" "streamers"`,
          lg: `"bits" "streamers"`
        }}
        gridTemplateColumns="1fr"
        gap={{ base: 6, md: 8, lg: 10 }}
        mb={{ base: 6, md: 8, lg: 12 }}
        width="100%"
        maxWidth="100%"
        overflow="hidden"
      >
        <MotionBox
          variants={itemVariants}
          gridArea="bits"
          width="100%"
          maxWidth="100%"
          overflow="hidden"
        >
          <BitsStats />
        </MotionBox>
        <MotionBox
          variants={itemVariants}
          gridArea="streamers"
          width="100%"
          maxWidth="100%"
          overflow="hidden"
        >
          <TopStreamers />
        </MotionBox>
      </Grid>
    </MotionBox>
  )

  return (
    <Box
      minH="100vh"
      w="100%"
      bg="gray.900"
      color="white"
      position="relative"
      overflow="hidden"
      _before={{
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: bgGradient,
        zIndex: 0
      }}
    >
      <Container
        maxW={{ base: "container.sm", md: "container.md", lg: "container.lg" }}
        px={{ base: 4, md: 6, lg: 8 }}
        py={{ base: 6, md: 8, lg: 12 }}
        position="relative"
        zIndex={1}
        mx="auto"
      >
        {metadataError ? (
          <Box textAlign="center" color="red.400">
            Error loading streamer metadata. Please try again later.
          </Box>
        ) : (
          renderContent()
        )}
      </Container>
    </Box>
  )
}

export default App
