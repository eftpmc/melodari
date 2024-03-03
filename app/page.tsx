"use client"

import { useEffect, useState } from 'react';
import { AuthUser } from '@supabase/supabase-js';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import { Flex, Box, Text, Button, VStack, Stack, Heading, useColorMode } from '@chakra-ui/react';
import Landing from '@/components/Landing';
import Root from '@/components/Root';


const Home: React.FC = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const supabase = createClientComponentClient<Database>();
  const { colorMode, toggleColorMode } = useColorMode();

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

  return (
    <>
      {user ? (
        <Root />
      ) : (
        <Landing />
      )}
    </>
  );
};

export default Home;
