import { Box, Heading, Grid, Container } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import TopStreamers from './components/TopStreamers'
import BitsStats from './components/BitsStats'
import IntroSection from './components/IntroSection'

const MotionBox = motion(Box)
const MotionHeading = motion(Heading)

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

  return (
    <Box
      minH="100vh"
      w="100vw"
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
        maxW="100%"
        px={{ base: 4, md: 8, lg: 12 }}
        py={{ base: 8, md: 12, lg: 16 }}
        position="relative"
        zIndex={1}
      >
        <MotionBox
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <MotionHeading
            variants={itemVariants}
            mb={{ base: 8, md: 12, lg: 16 }}
            textAlign="center"
            size={{ base: "2xl", md: "3xl", lg: "4xl" }}
            color="purple.400"
            letterSpacing="tight"
            fontWeight="bold"
            textShadow="0 0 20px rgba(139, 92, 246, 0.3)"
          >
            Twitch Chat Analytics
          </MotionHeading>

          <MotionBox
            variants={itemVariants}
            mb={{ base: 8, md: 12, lg: 16 }}
          >
            <IntroSection />
          </MotionBox>

          <Grid
            templateAreas={{
              base: `
                "bits"
                "streamers"
              `,
              md: `
                "bits streamers"
              `,
              lg: `
                "bits streamers"
              `
            }}
            gridTemplateColumns={{
              base: "1fr",
              md: "1fr 1fr",
              lg: "1fr 1fr"
            }}
            gap={{ base: 8, md: 10, lg: 12 }}
            mb={{ base: 8, md: 12, lg: 16 }}
          >
            <MotionBox
              variants={itemVariants}
              gridArea="bits"
            >
              <BitsStats />
            </MotionBox>
            <MotionBox
              variants={itemVariants}
              gridArea="streamers"
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
