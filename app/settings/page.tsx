"use client"

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import { useState, useEffect } from 'react';
import { Flex, Box, Text, Button, VStack, HStack, Stack, Heading, useColorMode } from '@chakra-ui/react';
import { Card, CardHeader, CardBody, CardFooter } from '@chakra-ui/react'
import Image from 'next/image';
import Link from 'next/link'

export default function Settings() {
  const supabase = createClientComponentClient<Database>();
  const [authUrl, setAuthUrl] = useState('');
  const [googleAuthenticated, setGoogleAuthenticated] = useState(false);

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

  useEffect(() => {
    async function checkGoogleAuthentication() {
      const { data: userData, error: userError } = await supabase.auth.getUser();

      if (userError) throw userError;
      if (!userData.user) {
        throw new Error('No authenticated user found.');
      }

      const userId = userData.user.id;

      const { data, error } = await supabase
        .from('profiles')
        .select('google_token')
        .eq('id', userId)

      if (!data) {
        console.log('No Google token found.');
        return;
      }

      const access_token = data[0].google_token;
      console.log(access_token)

      try {
        const response = await fetch('https://www.googleapis.com/oauth2/v1/userinfo?alt=json', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`, // Include the token in the Authorization header
          },
        });

        if (!response.ok) {
          throw new Error('Failed to validate token');
        }

        const data = await response.json();
        console.log(data)
        // Assuming the API returns { authenticated: true } if the token is valid
        if (data.authenticated) {
          setGoogleAuthenticated(true);
        } else {
          setGoogleAuthenticated(false);
        }
      } catch (error) {
        console.error('Error validating Google token:', error);
        setGoogleAuthenticated(false);
      }
    }

    checkGoogleAuthentication();
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
            settings
          </Heading>
          {googleAuthenticated ? (
            <HStack className='border-solid border-black dark:border-illustration border-2 rounded-md p-2'>
              <Image className="pl-2" src="/ytmusic.png" alt="ytmusic logo" width={35} height={35} />
              <Link href={authUrl}>
                <Text className='pr-2'>
                  connected
                </Text>
              </Link>
            </HStack>
          ) : (
            <HStack className='border-solid border-black dark:border-illustration border-2 rounded-md p-2'>
              <Image className="pl-2" src="/ytmusic.png" alt="ytmusic logo" width={35} height={35} />
              <Link href={authUrl}>
                <Text className='pr-2'>
                  connect youtube music
                </Text>
              </Link>
            </HStack>
          )}
        </Box>
        <Text fontSize="md" mt={8}>supported platforms:</Text>
        <Text fontSize="sm" my={2}>youtube music</Text>
      </Flex>
    </VStack>
  );
}
