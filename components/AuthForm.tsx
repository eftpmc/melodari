"use client"

import { useCallback } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import { IconButton, Icon, Box, Stack } from '@chakra-ui/react';
import { FaDiscord, FaGithub, FaGoogle } from 'react-icons/fa';

export default function AuthForm() {
    const supabase = createClientComponentClient<Database>();

    const signInWithProvider = useCallback(async (provider: 'github' | 'discord') => {
        const baseUrl = process.env.NODE_ENV === 'production'
            ? 'https://melodari.vercel.app' // Replace with your production URL
            : 'http://localhost:3000';

        await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: `${baseUrl}/auth/callback`,
            },
        });
    }, [supabase]);

    const signInWithGoogle = useCallback(async (provider: 'google') => {
        const baseUrl = process.env.NODE_ENV === 'production'
            ? 'https://melodari.vercel.app' // Replace with your production URL
            : 'http://localhost:3000';

        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${baseUrl}/auth/callback`,
                queryParams: {
                    access_type: 'offline',
                    prompt: 'consent',
                },
            },
        })
    }, [supabase]);

    return (
        <Box p={12}>
            <Stack direction="row" spacing={4} align="center">
                {/* <IconButton
                    icon={<Icon as={FaGithub} />}
                    aria-label="Connect to GitHub"
                    onClick={() => signInWithProvider('github')}
                    colorScheme="gray"
                    borderRadius="full"
                    w="auto"
                    px={8}
                />
                <IconButton
                    icon={<Icon as={FaDiscord} />}
                    aria-label="Connect to Discord"
                    onClick={() => signInWithProvider('discord')}
                    colorScheme="blue"
                    borderRadius="full"
                    w="auto"
                    px={8}
                /> */}
                <IconButton
                    icon={<Icon as={FaGoogle} />}
                    aria-label="Connect to Google"
                    onClick={() => signInWithGoogle('google')}
                    colorScheme="red"
                    borderRadius="full"
                    w="auto"
                    px={8}
                />
            </Stack>
        </Box>
    );
}
