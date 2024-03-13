"use client"

import React, { useEffect, useState } from 'react';
import PlaylistCarousel from '@/components/PlaylistCarousel'
import { EmblaOptionsType } from 'embla-carousel'
import { Flex, Box, Text, Button, VStack, HStack, Stack, Heading, IconButton, Grid, Tooltip, useColorMode } from '@chakra-ui/react';
import { useContext } from "react";
import { GoogleContext } from "@/contexts/GoogleContext";
import { Playlist } from "@/types/playlist"
import { Loader2 } from "lucide-react";

const OPTIONS: EmblaOptionsType = {
  loop: true,
  align: "start",
  inViewThreshold: 0.7,
}

export default function Dashboard() {
  const { playlists } = useContext(GoogleContext);

  return (
    <Flex
      direction="column"
      alignItems="center"
      justifyContent="center"
      overflow="hidden"
      p={8}
      pt={0}
    >
      {playlists ? (
        <PlaylistCarousel options={OPTIONS} />
      ) : (
        <div>
          <Loader2 className="h-4 w-4 animate-spin" />
          <Text fontSize="xl" mb={4}>loading playlists...</Text>
        </div>
      )}
    </Flex>
  );
}
