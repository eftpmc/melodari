import { useContext } from 'react';
import { GoogleContext } from "@/contexts/GoogleContext";
import Common from "@/utils/Common"
import useAuthorizedApiRequest from '@/utils/authorizeGoogle';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Playlist, PlaylistLabel } from "@/types/playlist"
import { Database, Json } from '@/types/supabase';

function googlePlaylists() {
  const supabase = createClientComponentClient<Database>();
  const { tokens, playlists, setPlaylists } = useContext(GoogleContext);

  const getUserId = Common();
  const makeRequest = useAuthorizedApiRequest();

  async function getPlaylistsFromStorage() {
    const userId: string | undefined = await getUserId()

    if (userId) {
      let { data, error: updateError } = await supabase
        .from('profiles')
        .select("playlist_data")
        .eq('id', userId)
        .single();

      if (updateError) throw updateError;

      if (data) {
        const PlaylistData: PlaylistLabel | null = data.playlist_data
        if (PlaylistData) {
          return PlaylistData;
        }
      }
    }
  }

  async function getPlaylistsFromAPI() {
    const playlistsResponse = await makeRequest('/api/ytmusic/getPlaylists', {
      method: 'GET',
    });

    const playlistsData: PlaylistLabel = await playlistsResponse;
    return playlistsData
  }

  async function formatAndSetPlaylists(playlistsData: PlaylistLabel) {
    if (playlistsData) {
      console.log(playlistsData)
      const formattedPlaylists: Playlist[] = playlistsData.playlists.map((playlist: any) => ({
        id: playlist.id,
        snippet: {
          title: playlist.snippet.title,
          thumbnails: {
            maxres: {
              url: playlist.snippet.thumbnails.maxres?.url || '/paradise.jpg',
            }
          }
        },
      }));
      return formattedPlaylists
    }
  }

  async function updatePlaylists(formattedPlaylists: Playlist[]) {
    const userId: string | undefined = await getUserId()

    const formatted = {
      playlists: formattedPlaylists,
    }

    if (userId) {
      let { data, error: updateError } = await supabase
        .from('profiles')
        .update({ playlist_data: formatted })
        .eq('id', userId);

      if (updateError) throw updateError;
    }
  }

  async function getPlaylistsVideos(playlistId: string) {
    if (playlistId && tokens) {
      const response = await fetch('/api/ytmusic/getVideos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ playlistId, tokens }), // Send the code as JSON in the body of the request
      });

      const idResponse = await response.json();
      console.log(idResponse)
      return idResponse;
    }
  }

  async function addPlaylistVideosToData(videos: Playlist[]) {
    const userId: string | undefined = await getUserId()

    if (videos) {
    }

    /*     if (userId) {
          let { data, error: updateError } = await supabase
            .from('profiles')
            .update({ playlist_data: addedPlaylist })
            .eq('id', userId);
    
          if (updateError) throw updateError;
        } */
  }

  return { getPlaylistsFromStorage, getPlaylistsFromAPI, formatAndSetPlaylists, updatePlaylists, getPlaylistsVideos };
}

export default googlePlaylists;