import { Flex, Box, Text, Button } from '@chakra-ui/react';
import Link from 'next/link';
import Image from 'next/image'

const Home: React.FC = () => {
  return (
<Flex
      height="flexGrow" // Sets the height to 100% of the viewport height
      alignItems="center" // Vertically centers the content
      justifyContent="center" // Horizontally centers the content
      overflow="hidden" // Prevents content from making the page scrollable
    >
      <Box textAlign="center" p={8}>
        <h2 className='m-4 font-bold text-5xl'>All things music.</h2>
        <Text className='mb-4 font-bold'>Discover, learn, and listen to music at Melodari.</Text>
        <Image className="mb-4" src="/music.svg" alt="Music Photo" width={500} height={500} />
        <Link href="/login" passHref>
          <Button colorScheme="purple">Get Started</Button>
        </Link>
      </Box>
    </Flex>
  );
};

export default Home;
