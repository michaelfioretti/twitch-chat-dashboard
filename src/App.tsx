import { Box, Container, Heading, VStack, Divider } from '@chakra-ui/react'
import StatsOverview from './components/StatsOverview'
import TopStreamers from './components/TopStreamers'
import BitsStats from './components/BitsStats'

function App() {
  return (
    <Box minH="100vh" bg="gray.900" color="white">
      <Container maxW="container.xl" py={8}>
        <Heading mb={8} textAlign="center">Twitch Chat Analytics</Heading>
        <VStack spacing={12} align="stretch">
          <StatsOverview />
          <Divider />
          <TopStreamers />
          <Divider />
          <BitsStats />
        </VStack>
      </Container>
    </Box>
  )
}

export default App
