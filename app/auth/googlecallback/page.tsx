"use client"

import { useEffect } from 'react';
import { Flex, Box, Text, Button, VStack, Stack, Heading, useColorMode } from '@chakra-ui/react';
import Image from 'next/image';

export default function GoogleCallback() {

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      console.log(code)
      exchangeCodeForToken(code);
    }
  }, []);

  async function exchangeCodeForToken(code : any) {
    
  }


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
            google callback
          </Heading>
          <Text fontSize="xl" mb={4}>ill be taking you back shortly<br></br> this is an annoying workaround to connect your google account</Text>
        </Box>
        <Text fontSize="md" mt={8}>supported platforms:</Text>
        <Text fontSize="sm" my={2}>youtube music</Text>
      </Flex>
    </VStack>
  );
}
