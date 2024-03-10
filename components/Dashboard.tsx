"use client"

import React, { useEffect, useState } from 'react';
import { Flex, Box, Text, Button, VStack, HStack, Stack, Heading, IconButton, Grid, Tooltip, useColorMode } from '@chakra-ui/react';
import { useContext } from "react";
import { GoogleContext } from "@/contexts/GoogleContext";
import { Loader2 } from "lucide-react";
import useAuthorizedApiRequest from '@/utils/authorizeGoogle';

interface Playlist {
  snippet: {
    title: string;
  };
}

export default function Dashboard() {
  const { tokens, authenticated, setAuthenticated } = useContext(GoogleContext);
  const [playlists, setPlaylists] = useState<Playlist[] | null>(null);

  const makeRequest = useAuthorizedApiRequest();
  console.log(authenticated)

  useEffect(() => {
    async function fetchPlaylists() {
      try {
        const playlistsResponse = await makeRequest('/api/ytmusic/getPlaylists', {
          method: 'GET',
        });

        const playlistsData = await playlistsResponse;

        if (playlistsData.playlists && Array.isArray(playlistsData.playlists)) {
          setPlaylists(playlistsData.playlists);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
    if (authenticated && tokens) {
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
        {playlists === null ? (
          <Box p={2}>
            <Loader2 className="h-4 w-4 animate-spin" />
          </Box>
        ) : (
          <Grid templateColumns="repeat(3, 1fr)" gap={2} p={2}>
            {playlists.map((playlist, index) => (
              <Box key={index} p={1} shadow="md" borderWidth="1px" className="playlist-item">
                <Text fontSize="xs" p={2} className="dark:text-white">{playlist.snippet.title}</Text>
              </Box>
            ))}
          </Grid>
        )}
      </VStack>
    </Flex>
  );
}
