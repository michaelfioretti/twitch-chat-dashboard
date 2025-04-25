import { Box, Heading, Grid } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import StatsOverview from './components/StatsOverview'
import TopStreamers from './components/TopStreamers'
import BitsStats from './components/BitsStats'

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
    <Box minH="100vh" bg="gray.900" color="white">
      <MotionBox
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        py={12}
        px={{ base: 4, md: 8, lg: 12 }}
      >
        <MotionHeading
          variants={itemVariants}
          mb={12}
          textAlign="center"
          size="2xl"
          color="purple.400"
          letterSpacing="tight"
          fontWeight="bold"
        >
          Twitch Chat Analytics
        </MotionHeading>

        <Grid
          templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }}
          gap={{ base: 8, lg: 12 }}
          mb={12}
        >
          <MotionBox variants={itemVariants}>
            <StatsOverview />
          </MotionBox>
          <MotionBox variants={itemVariants}>
            <BitsStats />
          </MotionBox>
        </Grid>

        <MotionBox variants={itemVariants}>
          <TopStreamers />
        </MotionBox>
      </MotionBox>
    </Box>
  )
}

export default App
