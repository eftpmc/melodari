"use client"

import { useCallback, useEffect, useState } from 'react';
import { Box, Stack, Button, FormControl, FormLabel, Input, useToast } from '@chakra-ui/react';
import { Database } from '@/types/supabase';
import { User, createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import SignOutButton from '@/components/SignOut';

export default function AccountForm({ user }: { user: User | null }) {
  const supabase = createClientComponentClient<Database>();
  const [loading, setLoading] = useState(true);
  const [fullname, setFullname] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const toast = useToast();

  const getProfile = useCallback(async () => {

    if (!user){
      return (
        <div>Loading</div>
      )
    }
    try {
      setLoading(true);

      const { data, error, status } = await supabase
        .from('profiles')
        .select(`full_name, username, avatar_url`)
        .eq('id', user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setFullname(data.full_name);
        setUsername(data.username);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      toast({
        title: 'Error loading user data!',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [user, supabase, toast]);

  useEffect(() => {
    getProfile();
  }, [getProfile]);

  async function updateProfile({ username, avatar_url, fullname }: { username: string | null; fullname: string | null; avatar_url: string | null; }) {
    try {
      setLoading(true);

      const { error } = await supabase.from('profiles').upsert({
        id: user?.id as string,
        full_name: fullname,
        username,
        avatar_url,
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;

      toast({
        title: 'Profile updated!',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error updating the data!',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box p={5}>
      <FormControl id="email" mb={4}>
        <FormLabel>Email</FormLabel>
        <Input type="text" value={user?.email || ''} isReadOnly />
      </FormControl>
      <FormControl id="fullName" mb={4}>
        <FormLabel>Full Name</FormLabel>
        <Input type="text" value={fullname || ''} onChange={(e) => setFullname(e.target.value)} />
      </FormControl>
      <FormControl id="username" mb={4}>
        <FormLabel>Username</FormLabel>
        <Input type="text" value={username || ''} onChange={(e) => setUsername(e.target.value)} />
      </FormControl>

      {/* Buttons with Stack for alignment and spacing */}
      <Stack direction="column" spacing={4}>
        <Button
          colorScheme="blue"
          isLoading={loading}
          onClick={() => updateProfile({ fullname, username, avatar_url: avatarUrl })}
        >
          Update
        </Button>
        <SignOutButton></SignOutButton>
      </Stack>
    </Box>
  );
}
