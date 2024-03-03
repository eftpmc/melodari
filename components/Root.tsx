"use client"

import React, { useEffect, useState } from 'react';
import { Button, Flex, Box, Text, VStack, Heading } from '@chakra-ui/react';
import Image from 'next/image';
import Link from 'next/link'


export default function Root() {
  const [authUrl, setAuthUrl] = useState('');

  useEffect(() => {
    async function fetchAuthUrl() {
      const response = await fetch('/api/ytmusic/getURL');
      const data = await response.json();
      if (data.url) {
        setAuthUrl(data.url); // Correctly extract the URL from the JSON object
      } else {
        console.error('Authorization URL not found.');
      }
    }

    fetchAuthUrl();
  }, []);

  return (
    <VStack spacing={8}>
      <Box position="absolute" left="0" top="75">
        <Image src="/DRAGON.svg" className="invisible lg:visible lg:w-[300px] xl:w-[500px]" alt="art" width={500} height={500} />
      </Box>
      <Flex
        direction="column"
        alignItems="center"
        justifyContent="center"
        overflow="hidden"
        pt={8}
      >
        <Box textAlign="center" p={8}>
          <Heading as="h2" size="2xl" mb={4} fontWeight="bold">
            home
          </Heading>
          <Text fontSize="xl" mb={4}>dashboard?</Text>
          <Link href={authUrl}>
            <Button colorScheme="red">
              Connect YouTube Music
            </Button>
          </Link>
        </Box>
      </Flex>
    </VStack>
  );
}
