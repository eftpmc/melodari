"use client"

import { Flex, Box, Text, Button, VStack, Stack, Heading, useColorMode } from '@chakra-ui/react';
import Image from 'next/image';
import AuthForm from '@/components/AuthForm';

export default function Landing() {

    return (
        <VStack spacing={8} className="overflow-hidden">
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
                        melodari
                    </Heading>
                    <Text fontSize="xl" mb={4}>music wrapper for music platforms designed<br></br> to enhance the way you listen to music</Text>
                </Box>
                <AuthForm />
                <Text fontSize="md" mt={8}>supported platforms:</Text>
                <Text fontSize="sm" my={2}>youtube music</Text>
            </Flex>
        </VStack>
    );
}
