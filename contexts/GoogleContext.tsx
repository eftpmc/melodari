"use client";

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database, Json } from '@/types/supabase';
import { ReactNode, createContext, useEffect, useState } from "react";
import { GoogleTokens } from "@/types/googletokens"
import { Playlist } from "@/types/playlist"

interface GoogleContext {
  tokens: GoogleTokens | null;
  setTokens: (tokens: GoogleTokens | null) => void;
  authenticated: true | false;
  setAuthenticated: (authenticated: true | false) => void;
  playlists: Playlist[] | null;
  setPlaylists: (playlists: Playlist[] | null) => void;
}

export const GoogleContext = createContext<GoogleContext>({
  tokens: null,
  authenticated: false,
  playlists: null,
  setTokens: () => { },
  setAuthenticated: () => { },
  setPlaylists: () => { },
  
});

interface Props {
  children: ReactNode;
}

export const GoogleProvider = ({ children }: Props) => {
  const supabase = createClientComponentClient<Database>();
  const [tokens, setTokens] = useState<GoogleTokens | null>(null);
  const [authenticated, setAuthenticated] = useState<true | false>(false);
  const [playlists, setPlaylists] = useState<Playlist[] | null>(null);

  useEffect(() => {
    async function getTokens() {
      try {
        const { data: userData, error: userError } = await supabase.auth.getUser();

        if (userError) throw userError;
        if (!userData.user) {
          throw new Error('No authenticated user found.');
        }

        const userId = userData.user.id;

        let { data, error: updateError } = await supabase
          .from('profiles') // Temporarily use `any` to bypass typing issues.
          .select("google_tokens") // Use `->>` to get JSON object as text and alias it as 'tokens'.
          .eq('id', userId)
          .single();

        if (updateError) throw updateError;

        if (data && data.google_tokens && data.google_tokens.tokens) {
          const tokens = data.google_tokens.tokens;
          await fetch('/api/ytmusic/setTokens', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ tokens }),
          });
          setTokens(tokens);
          setAuthenticated(true);
        }
        else {
          setAuthenticated(false);
        }

      } catch (error) {
        console.error('Error:', error);
      }
    }

    getTokens();
  }, []);

  return (
    <GoogleContext.Provider value={{ tokens, setTokens, authenticated, setAuthenticated, playlists, setPlaylists }}>
      {children}
    </GoogleContext.Provider>
  );
};