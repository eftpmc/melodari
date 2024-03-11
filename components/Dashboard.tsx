"use client"

import React, { useEffect, useState } from 'react';
import PlaylistCarousel from '@/components/PlaylistCarousel'
import { EmblaOptionsType } from 'embla-carousel'
import { Flex, Box, Text, Button, VStack, HStack, Stack, Heading, IconButton, Grid, Tooltip, useColorMode } from '@chakra-ui/react';
import { useContext } from "react";
import { GoogleContext } from "@/contexts/GoogleContext";
import useAuthorizedApiRequest from '@/utils/authorizeGoogle';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database, Json } from '@/types/supabase';
import { Playlist } from "@/types/playlist"
import { Loader2 } from "lucide-react";

const OPTIONS: EmblaOptionsType = {}

export default function Dashboard() {
  const supabase = createClientComponentClient<Database>();
  const { tokens, authenticated, playlists, setPlaylists } = useContext(GoogleContext);

  const makeRequest = useAuthorizedApiRequest();

  useEffect(() => {
    async function fetchPlaylists() {
      try {
        const { data: userData, error: userError } = await supabase.auth.getUser();

        if (userError) throw userError;
        if (!userData.user) {
          throw new Error('No authenticated user found.');
        }

        const userId = userData.user.id;

        let { data, error: updateError } = await supabase
          .from('profiles') // Temporarily use `any` to bypass typing issues.
          .select("playlist_data") // Use `->>` to get JSON object as text and alias it as 'tokens'.
          .eq('id', userId)
          .single();

        if (updateError) throw updateError;

        if (data) {
          const playlistsData = await data.playlist_data;
          if (playlistsData) {
            const formattedPlaylists: Playlist[] = playlistsData.playlists.map((playlist: any) => ({
              snippet: {
                title: playlist.snippet.title,
                thumbnails: {
                  maxres: {
                    url: playlist.snippet.thumbnails.maxres?.url || '/paradise.jpg',
                  }
                }
              },
            }));
            setPlaylists(formattedPlaylists)
          }
        } else {
          const playlistsResponse = await makeRequest('/api/ytmusic/getPlaylists', {
            method: 'GET',
          });

          const playlistsData = await playlistsResponse;

          if (playlistsData.playlists && Array.isArray(playlistsData.playlists)) {
            setPlaylists(playlistsData.playlists);

            let { data, error: updateError } = await supabase
              .from('profiles')
              .update({ playlist_data: playlistsData })
              .eq('id', userId);

            if (updateError) throw updateError;
          }
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
      {playlists ? (
        <PlaylistCarousel slides={playlists} options={OPTIONS} />
      ) : (
        <div>
          <Loader2 className="h-4 w-4 animate-spin" />
          <Text fontSize="xl" mb={4}>loading playlists...</Text>
        </div>
      )}
    </Flex>
  );
}
