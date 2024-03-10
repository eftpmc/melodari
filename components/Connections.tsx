"use client"

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import React, { useEffect, useState } from 'react';
import { Flex, Box, Text, Button, VStack, HStack, Stack, Heading, IconButton, Tooltip, useColorMode } from '@chakra-ui/react';
import { SiYoutubemusic } from "react-icons/si";
import { useContext } from "react";
import { GoogleContext } from "@/contexts/GoogleContext";
import Link from 'next/link'

export default function Connections() {
  const supabase = createClientComponentClient<Database>();
  const { authenticated, setAuthenticated } = useContext(GoogleContext);
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
    <VStack
      spacing={4}
      align="stretch"
      max-w="600px"
      p={8}
    >
      <VStack spacing={2} className="bg-illustration rounded-md">
        <Heading size="sm" textAlign="left" pt={4} pl={2} className="w-full dark:text-white">Add Music</Heading>
        <Text fontSize="xs" pl={2} pr={2} className="dark:text-white">We specifically target permissions that can be viewed when connecting your account.</Text>
        <HStack textAlign="center" pb={4}>
          {!authenticated && (
            <Link href={authUrl}>
              <Tooltip label='Youtube Music'>
                <IconButton
                  variant='outline'
                  colorScheme='red'
                  aria-label='connect ytmusic'
                  icon={<SiYoutubemusic />}
                />
              </Tooltip>
            </Link>
          )}
        </HStack>
      </VStack>
      {authenticated && (
        <VStack spacing={2} className="bg-illustration rounded-md">
          <HStack p={2}>
            <SiYoutubemusic className='text-white'></SiYoutubemusic>
            <Heading size="sm" textAlign="left" className="w-full dark:text-white">Youtube Music</Heading>
          </HStack>
        </VStack>
      )}
    </VStack>
  );
}
