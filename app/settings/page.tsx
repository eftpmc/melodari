"use client"

import React, { useState, useEffect } from 'react';
import { Flex, Box, Text, Button, VStack, HStack, Stack, Heading, IconButton, useColorMode } from '@chakra-ui/react';
import Image from 'next/image';
import Connections from '@/components/Connections';

export default function Settings() {

  return (
    <VStack spacing={8}>
      <Box position="absolute" left="0" top="75">
        <Image src="/DRAGON.svg" className="invisible lg:visible lg:w-[300px] xl:w-[500px]" alt="art" width={500} height={500} />
      </Box>
      <Connections></Connections>
    </VStack>
  );
}
