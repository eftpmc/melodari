"use client"

import { useEffect, useState } from 'react';
import { AuthUser } from '@supabase/supabase-js';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import {
    Button, Box, IconButton, Flex, Divider, useColorMode,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuItemOption,
    MenuGroup,
    MenuOptionGroup,
    MenuDivider,
    useToast,
} from '@chakra-ui/react';
import { MoonIcon, StarIcon } from '@chakra-ui/icons';
import { BsFillGridFill } from "react-icons/bs";
import { useRouter } from 'next/navigation';
import { Link } from '@chakra-ui/next-js';
import { Database } from '@/types/supabase';

const Header: React.FC = () => {
    const { colorMode, toggleColorMode } = useColorMode();
    const [user, setUser] = useState<AuthUser | null>(null);
    const supabase = createClientComponentClient<Database>();
    const toast = useToast();
    const router = useRouter();

    useEffect(() => {
        const checkUser = async () => {
            const { data, error } = await supabase.auth.getSession();

            if (error) {
                console.error('Error fetching user data:', error.message);
                setUser(null); // Explicitly set to null in case of error
            } else {
                setUser(data.session?.user ?? null);
            }
        };

        checkUser();
    }, [supabase.auth]);


    const navigate = (path: string) => {
        router.push(path);
    };

    const signOut = async () => {
        try {
            const response = await fetch('/auth/signout', {
                method: 'POST',
            });

            if (!response.ok) throw new Error('Failed to sign out.');

            // Redirect or refresh the page upon successful signout
            window.location.href = '/';
        } catch (error) {
            toast({
                title: 'Error signing out',
                description: (error as Error).message,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    return (
        <>
            <Flex as="header" width="full" py={4} px={8} align="center" justify="space-between">
                <Flex align="center">
                    <Link href="/">
                        Melodari
                    </Link>
                </Flex>

                <Flex align="center" justifyContent="center">
                </Flex>

                <Flex align="center" justifyContent="flex-end" gap="2">
                    <Menu>
                        {user && ( // Conditionally render based on user state
                            <Menu>
                                <MenuButton as={IconButton} aria-label="Options" icon={<BsFillGridFill />} size="lg" />
                                <MenuList>
                                    <MenuItem onClick={() => router.push('/account')}>Account</MenuItem>
                                    <MenuItem onClick={signOut}>Sign Out</MenuItem>
                                    <MenuItem>Mark as Draft</MenuItem>
                                    <MenuItem>Delete</MenuItem>
                                    <MenuItem>Attend a Workshop</MenuItem>
                                </MenuList>
                            </Menu>
                        )}
                        <MenuList>
                            <MenuItem onClick={() => navigate('/account')}>Account</MenuItem>
                            <MenuItem onClick={() => signOut()}>Sign Out</MenuItem>
                            <MenuItem>Mark as Draft</MenuItem>
                            <MenuItem>Delete</MenuItem>
                            <MenuItem>Attend a Workshop</MenuItem>
                        </MenuList>
                    </Menu>

                    <IconButton
                        aria-label="Toggle Mode"
                        onClick={toggleColorMode}
                        icon={colorMode === 'light' ? <MoonIcon /> : <StarIcon />}
                        size="lg"
                    />
                </Flex>
            </Flex>
            <Divider orientation="horizontal" />
        </>
    );
};

export default Header;
