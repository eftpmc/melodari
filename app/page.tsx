import { Flex, Box, Text, Button } from '@chakra-ui/react';
import Link from 'next/link';
import AuthForm from '@/components/AuthForm'; // Adjust the import path as necessary

const Home: React.FC = () => {
  return (
<Flex
      height="flexGrow" // Sets the height to 100% of the viewport height
      alignItems="center" // Vertically centers the content
      justifyContent="center" // Horizontally centers the content
      overflow="hidden" // Prevents content from making the page scrollable
    >
      <Box textAlign="center" p={8}>
        <Text fontSize="2xl" mb="4">Welcome to Our App!</Text>
        <Text mb="8">Your journey starts here.</Text>
        <Link href="/login" passHref>
          <Button colorScheme="blue">Login / Sign Up</Button>
        </Link>
      </Box>
    </Flex>
  );
};

export default Home;
