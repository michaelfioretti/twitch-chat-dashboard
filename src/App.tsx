import { Box, Heading, Grid, Container } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import TopStreamers from './components/TopStreamers'
import BitsStats from './components/BitsStats'
import IntroSection from './components/IntroSection'
import StreamerSearch from './components/StreamerSearch'
import { useQuery } from '@tanstack/react-query'
import { API_ENDPOINTS } from './constants/api'

const MotionBox = motion(Box)
const MotionHeading = motion(Heading)

interface StreamerMetadata {
  name: string;
  broadcasterType: string;
  description: string;
  image: string;
}

function App() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  }

  const { data: metadataData } = useQuery<StreamerMetadata[]>({
    queryKey: ['streamerMetadata'],
    queryFn: async () => {
      const response = await fetch(API_ENDPOINTS.STREAMER_METADATA);
      if (!response.ok) {
        throw new Error('Failed to fetch streamer metadata');
      }
      return response.json();
    }
  });

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
        background: "radial-gradient(circle at center, rgba(139, 92, 246, 0.1) 0%, transparent 70%)",
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

          <MotionBox
            variants={itemVariants}
            mb={{ base: 6, md: 8, lg: 12 }}
          >
            <IntroSection />
          </MotionBox>

          <MotionBox
            variants={itemVariants}
            mb={{ base: 6, md: 8, lg: 12 }}
          >
            <StreamerSearch metadata={metadataData || []} />
          </MotionBox>

          <Grid
            templateAreas={{
              base: `
                "bits"
                "streamers"
              `,
              md: `
                "bits"
                "streamers"
              `,
              lg: `
                "bits"
                "streamers"
              `
            }}
            gridTemplateColumns={{
              base: "1fr",
              md: "1fr",
              lg: "1fr"
            }}
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
      </Container>
    </Box>
  )
}

export default App
