"use client"

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import React, { useState, useEffect } from 'react';
import { Flex, Box, Text, Button, VStack, Stack, Heading, useColorMode } from '@chakra-ui/react';
import Image from 'next/image';
import { Loader2 } from "lucide-react";
import { useRouter } from 'next/navigation'

export default function GoogleCallback() {
  const supabase = createClientComponentClient<Database>();
  const router = useRouter()

  useEffect(() => {
    async function handleCodeExchange() {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');

      if (!code) {
        console.error('No code found in URL parameters.');
        return;
      }

      try {
        const response = await fetch('/api/ytmusic/exchangeCode', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code }), // Send the code as JSON in the body of the request
        });

        const token = await response.json();
        console.log(token)

        // Assuming token is directly the received object you wish to use
        if (!token) {
          throw new Error('Token not received.');
        }

        const { data: userData, error: userError } = await supabase.auth.getUser();

        if (userError) throw userError;
        if (!userData.user) {
          throw new Error('No authenticated user found.');
        }

        const userId = userData.user.id;

        let { data, error: updateError } = await supabase
          .from('profiles')
          .update({ google_tokens:  token})
          .eq('id', userId);

        if (updateError) throw updateError;

        router.push("/")
      } catch (error) {
        console.error('Error:', error);
      }
    }

    handleCodeExchange();
  }, [supabase]);

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
            google connection
          </Heading>
          <Text fontSize="xl">authenticating</Text>
        </Box>
        <Loader2 className="h-4 w-4 animate-spin" size={48}/>
        <Text fontSize="md" mt={8}>supported platforms:</Text>
        <Text fontSize="sm" my={2}>youtube music</Text>
      </Flex>
    </VStack>
  );
}
