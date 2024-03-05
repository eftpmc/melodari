"use client"

import React, { useEffect, useState } from 'react';
import { Flex, Box, Text, Button, VStack, HStack, Stack, Heading, IconButton, Tooltip, useColorMode } from '@chakra-ui/react';
import { SiYoutubemusic } from "react-icons/si";
import { useContext } from "react";
import { GoogleContext } from "@/contexts/GoogleContext";

export default function Dashboard() {
  const { tokens, authenticated } = useContext(GoogleContext);

  console.log(authenticated)
  console.log(tokens)

  useEffect(() => {
    if (authenticated && tokens) {
    async function fetchPlaylists() {
      try {
        const apiKeyResponse = await fetch('/api/ytmusic/getAPI');
        const apiKeyData = await apiKeyResponse.json();
        if (apiKeyData){
          const apiKey = apiKeyData.api;

          const response = await fetch(`https://youtube.googleapis.com/youtube/v3/playlists?part=contentDetails&maxResults=20&mine=true&key=${apiKey}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokens?.access_token}`, // Include the token in the Authorization header
          },
        });

        if (!response.ok) {
          throw new Error('Failed to validate token');
        }

        const data = await response.json();
        console.log(data)
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }

    fetchPlaylists();
  }
}, [authenticated, tokens]);

  return (
    <Flex
      direction="column"
      alignItems="center"
      justifyContent="center"
      overflow="hidden"
      p={8}
    >
      <VStack spacing={2} className="bg-illustration rounded-md">
        <Heading size="sm" textAlign="left" p={2} pb={0} className="w-full dark:text-white">Dashboard</Heading>
        <Text fontSize="xs" p={2} pt={0} className="dark:text-white">This is your dashboard where you manage your music.</Text>
      </VStack>
    </Flex>
  );
}
