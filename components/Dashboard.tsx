"use client"

import React, { useEffect, useState } from 'react';
import { Flex, Box, Text, Button, VStack, HStack, Stack, Heading, IconButton, Tooltip, useColorMode } from '@chakra-ui/react';
import { useContext } from "react";
import { GoogleContext } from "@/contexts/GoogleContext";
import { Loader2 } from "lucide-react";

interface Playlist {
  snippet: {
    title: string;
  };
}

export default function Dashboard() {
  const { tokens, authenticated, setAuthenticated } = useContext(GoogleContext);
  const [playlists, setPlaylists] = useState<Playlist[] | null>(null);

  console.log(authenticated)

  useEffect(() => {

    async function fetchPlaylists() {
      try {
        const playlistsResponse = await fetch('/api/ytmusic/getPlaylists');
        const playlistsData = await playlistsResponse.json();

        if (playlistsData.playlists && Array.isArray(playlistsData.playlists)) {
          setPlaylists(playlistsData.playlists);
          setAuthenticated(false);
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
            <Loader2 className="h-4 w-4 animate-spin"/>
          </Box>
        ) : playlists.map((playlist, index) => (
          <Box key={index} p={5} shadow="md" borderWidth="1px" className="playlist-item">
            <Text fontSize="xs" p={2} pt={0} className="dark:text-white">{playlist.snippet.title}</Text>
          </Box>
        ))}
      </VStack>
    </Flex>
  );
}
